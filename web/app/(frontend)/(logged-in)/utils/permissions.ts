import { Session } from "@/auth"
import { Assessment } from "@/prisma/mssql/generated/client"
import { fetchAssessments } from "./dataFetchers"

export function isAdmin(session: Session | null): boolean { 
    return session?.user?.systemRoles.find(role => role.name === "Admin") !== undefined 
}

export function isCollectionManager(session: Session | null): boolean { 
    return session?.user?.systemRoles.find(role => role.name === "Collection Manager") !== undefined 
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