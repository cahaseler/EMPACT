import { Session } from "@/auth"
import { User, Assessment, AssessmentUserResponse } from "@/prisma/mssql/generated/client"
import { 
    fetchAssessments, 
    fetchAllResponsesForAssessment, 
    fetchUserResponsesForAssessment,
    fetchAllResponsesForAssessmentAttribute,
    fetchUserResponseForAssessmentAttribute
} from "./dataFetchers"

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

export function isParticipantForAssessment(session: Session | null, assessmentId: string): boolean { 
    // Since the id is coming from the url, it's a string, so we need to convert it to an integer
    const idAsInteger = parseInt(assessmentId, 10)
    // Technically, users could put anything into a URL, so we need to make sure it's a number
    if(isNaN(idAsInteger)) {
      return false
    }
    const assessmentUser = session?.user?.assessmentUser.find(uc => uc.assessmentId === idAsInteger)
    return assessmentUser?.role === "Participant"
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

export async function viewableResponses(session: Session | null, assessmentId: string): Promise<AssessmentUserResponse[]> {
    if (session) {
        if (isParticipantForAssessment(session, assessmentId)) {
            return await fetchUserResponsesForAssessment(session.user.id, assessmentId)
        }
        else {
            return await fetchAllResponsesForAssessment(assessmentId)
        }
    }
    return []
}

export async function viewableAttributeResponses(
    session: Session | null, 
    assessmentId: string,
    attributeId: string
): Promise<(AssessmentUserResponse & { user?: User })[]> {
    if (session) {
        if (isParticipantForAssessment(session, assessmentId)) {
            const response = await fetchUserResponseForAssessmentAttribute(session.user.id, assessmentId, attributeId)
            return response ? [response] : []
        }
        else {
            return await fetchAllResponsesForAssessmentAttribute(assessmentId, attributeId)
        }
    }
    return []
}