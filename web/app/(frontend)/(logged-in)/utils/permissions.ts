import { Session } from "@/auth"
import { Assessment, AssessmentUser, Permission } from "@/prisma/mssql/generated/client"
import { fetchAssessments, fetchAssessmentUsersWithPermissions, fetchAssessmentUserWithPermissions } from "./dataFetchers"

export function isAdmin(session: Session | null): boolean { 
    return session?.user?.systemRoles.find(role => role.name === "Admin") !== undefined 
}

export function isCollectionManager(session: Session | null): boolean { 
    return session?.user?.systemRoles.find(role => role.name === "Collection Manager") !== undefined 
}

export function isManagerForCollection(session: Session | null, assessmentCollectionId: number | null | undefined): boolean { 
    const assessmentUser = session?.user?.assessmentCollectionUser.find(uc => uc.assessmentCollectionId === assessmentCollectionId)
    return assessmentUser?.role === "Collection Manager"
}

export function isLeadForAssessment(session: Session | null, assessmentId: string): boolean { 
    // Since the id is coming from the url, it's a string, so we need to convert it to an integer
    const idAsInteger = parseInt(assessmentId, 10)
    // Technically, users could put anything into a URL, so we need to make sure it's a number
    if(isNaN(idAsInteger)) {
      return false
    }
    const assessmentUser = session?.user?.assessmentUser.find(uc => uc.assessmentId === idAsInteger)
    return assessmentUser?.role === "Lead Facilitator"
}

export function isFacForAssessment(session: Session | null, assessmentId: string): boolean { 
    // Since the id is coming from the url, it's a string, so we need to convert it to an integer
    const idAsInteger = parseInt(assessmentId, 10)
    // Technically, users could put anything into a URL, so we need to make sure it's a number
    if(isNaN(idAsInteger)) {
      return false
    }
    const assessmentUser = session?.user?.assessmentUser.find(uc => uc.assessmentId === idAsInteger)
    return assessmentUser?.role === "Facilitator"
}

export async function getAssessmentUsersWithPermissions(session: Session | null): Promise<(AssessmentUser & { permissions: Permission[] })[]> { 
    if(!session || !session.user) return []
    return await fetchAssessmentUsersWithPermissions(session.user.id)
}

export async function getAssessmentUserPermissions(session: Session | null, assessmentId: string): Promise<Permission[]> { 
    // Since the id is coming from the url, it's a string, so we need to convert it to an integer
    const idAsInteger = parseInt(assessmentId, 10)
    // Technically, users could put anything into a URL, so we need to make sure it's a number
    if(isNaN(idAsInteger)) {
      return []
    }
    const assessmentUser = session?.user?.assessmentUser.find(uc => uc.assessmentId === idAsInteger)
    if(!assessmentUser) return []
    const assessmentUserWithPermissions = await fetchAssessmentUserWithPermissions(assessmentUser.id)
    return assessmentUserWithPermissions?.permissions || []
}

// User can view Users tab in navbar if they are any role but a participant
export function canViewUsers(session: Session | null): boolean { 
    return session?.user?.systemRoles.length !== undefined && session?.user?.systemRoles.length > 0 
}

export async function viewableAssessments(session: Session | null, assessmentGroupId: string): Promise<Assessment[]> { 
    if (session) {
        const assessments = await fetchAssessments(assessmentGroupId)
        // Admins can view all assessments
        if (isAdmin(session)) return assessments
        // Collection Managers can view all assessments in their assigned collections
        else if (isCollectionManager(session)) {
            const assessmentCollectionIds = session.user.assessmentCollectionUser.map(uc => uc.assessmentCollectionId)
            return assessments.filter(assessment => 
                assessmentCollectionIds.find(id => id === assessment.assessmentCollectionId)
            )
        }
        // Any other users can only view their assigned assessments
        else {
            const assessmentIds = session.user.assessmentUser.map(uc => uc.assessmentId)
            return assessments.filter(assessment => 
                assessmentIds.find(id => id === assessment.id)
            )
        }
    }
    return []
}