import {
  Assessment,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section,
  User,
} from "@/prisma/mssql/generated/client"
import {
  fetchAllResponsesForAssessment,
  fetchAllResponsesForAssessmentAttribute,
  fetchAssessmentCollections,
  fetchAssessments,
  fetchPartsSectionsAttributes,
  fetchUserResponseForAssessmentAttribute,
  fetchUserResponsesForAssessment,
} from "./dataFetchers"

type Session = {
  user: CustomJwtSessionClaims["metadata"]
}

type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function isAdmin(session: Session | null): boolean {
  return (
    session?.user?.systemRoles?.find((role) => role.name === "Admin") !==
    undefined
  )
}

export function isCollectionManager(session: Session | null): boolean {
  return (
    session?.user?.assessmentCollectionUser?.some(
      (uc) => uc.role === "Collection Manager"
    ) === true
  )
}

export function isManagerForCollection(
  session: Session | null,
  assessmentCollectionId: number | null | undefined
): boolean {
  const assessmentUser = session?.user?.assessmentCollectionUser?.find(
    (uc) => uc.assessmentCollectionId === assessmentCollectionId
  )
  return assessmentUser?.role === "Collection Manager"
}

export function isLeadForAssessment(
  session: Session | null,
  assessmentId: string
): boolean {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return false
  }
  const assessmentUser = session?.user?.assessmentUser?.find(
    (uc) => uc.assessmentId === idAsInteger
  )
  return assessmentUser?.role === "Lead Facilitator"
}

export function isFacForAssessment(
  session: Session | null,
  assessmentId: string
): boolean {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return false
  }
  const assessmentUser = session?.user?.assessmentUser?.find(
    (uc) => uc.assessmentId === idAsInteger
  )
  return assessmentUser?.role === "Facilitator"
}

export function canUserParticipateInPart(
  session: Session | null,
  assessmentId: string,
  partId: number
): boolean {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return false
  }
  const assessmentUser = session?.user?.assessmentUser?.find(
    (uc) => uc.assessmentId === idAsInteger
  )
  const participantPart = assessmentUser?.participantParts.find(
    (part) => part.id === partId
  )
  return participantPart !== undefined || assessmentUser?.role === "Participant"
}

export function isParticipantForAssessment(
  session: Session | null,
  assessmentId: string
): boolean {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return false
  }
  const assessmentUser = session?.user?.assessmentUser?.find(
    (uc) => uc.assessmentId === idAsInteger
  )
  return assessmentUser?.role === "Participant"
}

// User can view Users tab in navbar if they are any role but a participant
export function canViewUsers(session: Session | null): boolean {
  return (
    isAdmin(session) ||
    isCollectionManager(session) ||
    session?.user?.assessmentUser?.some(
      (uc) =>
        uc.role === "Lead Facilitator" ||
        uc.role === "Facilitator"
    ) === true
  )
}

export async function viewableCollections(
  session: Session | null,
  assessmentGroupId: string
): Promise<
  (AssessmentCollection & {
    assessments: Assessment[]
    assessmentCollectionUser: (AssessmentCollectionUser & { user: User })[]
  })[]
> {
  if (session) {
    const assessmentCollections =
      await fetchAssessmentCollections(assessmentGroupId)
    if (isAdmin(session)) return assessmentCollections
    else {
      const assessmentCollectionIds =
        session.user.assessmentCollectionUser?.map(
          (uc) => uc.assessmentCollectionId
        )
      return assessmentCollections.filter((collection) =>
        assessmentCollectionIds?.find((id) => id === collection.id)
      )
    }
  }
  return []
}

export async function viewableAssessments(
  session: Session | null,
  assessmentGroupId: string
): Promise<(Assessment & { assessmentUser: (AssessmentUser & { user: User })[] })[]> {
  if (session) {
    const assessments = await fetchAssessments(assessmentGroupId)
    // Admins can view all assessments
    if (isAdmin(session)) return assessments
    // Collection Managers can view all assessments in their assigned collections
    else if (isCollectionManager(session)) {
      const assessmentCollectionIds =
        session.user.assessmentCollectionUser?.map(
          (uc) => uc.assessmentCollectionId
        )
      return assessments.filter((assessment) =>
        assessmentCollectionIds?.find(
          (id) => id === assessment.assessmentCollectionId
        )
      )
    }
    // Any other users can only view their assigned assessments
    else {
      const assessmentIds = session.user.assessmentUser?.map(
        (uc) => uc.assessmentId
      )
      return assessments.filter((assessment) =>
        assessmentIds?.find((id) => id === assessment.id)
      )
    }
  }
  return []
}

export async function viewableParts(
  session: Session | null,
  assessmentGroupId: string,
  assessmentId: string,
  role: string
): Promise<(Part & { sections: (Section & { attributes: Attribute[] })[] })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  if (session) {
    const parts = await fetchPartsSectionsAttributes(assessmentGroupId)
    if (role === "Participant") {
      const assessmentUser = session.user.assessmentUser?.find(
        (uc) => uc.assessmentId === idAsInteger
      )
      if (assessmentUser?.role !== "Participant") {
        const participantPartIds = assessmentUser?.participantParts.map(
          (part) => part.partId
        )
        const viewableParts = parts.filter((part) =>
          participantPartIds?.includes(part.id)
        )
        return viewableParts
      }
      return parts
    } else {
      return parts
    }
  }
  return []
}

export async function viewableResponses(
  session: Session | null,
  assessmentId: string,
  role: string
): Promise<AssessmentUserResponse[]> {
  if (session) {
    const user = session.user as UserInfo
    if (role === "Participant") {
      return await fetchUserResponsesForAssessment(
        user.id,
        assessmentId
      )
    } else {
      return await fetchAllResponsesForAssessment(assessmentId)
    }
  }
  return []
}

export async function viewableAttributeResponses(
  session: Session | null,
  assessmentId: string,
  attributeId: string,
  role: string
): Promise<(AssessmentUserResponse & { user?: User, level?: Level })[]> {
  if (session) {
    const user = session.user as UserInfo
    if (role === "Participant") {
      const response = await fetchUserResponseForAssessmentAttribute(
        user.id,
        assessmentId,
        attributeId
      )
      return response ? [response] : []
    } else {
      return await fetchAllResponsesForAssessmentAttribute(
        assessmentId,
        attributeId
      )
    }
  }
  return []
}
