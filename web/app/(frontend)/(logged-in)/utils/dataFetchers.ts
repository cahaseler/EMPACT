"use server"
import { db } from "@/lib/db"
import { 
  User,
  SystemRole,
  AssessmentType, 
  AssessmentCollection,
  AssessmentCollectionUser,
  Assessment, 
  AssessmentUser, 
  AssessmentUserResponse,
  Part, 
  Section, 
  Attribute, 
  Level
} from "@/prisma/mssql/generated/client"
import * as assessmentType from "@/app/utils/assessmentType"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessment from "@/app/utils/assessment"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"
import * as part from "@/app/utils/part"
import * as section from "@/app/utils/section"
import * as attribute from "@/app/utils/attribute"
import * as level from "@/app/utils/level"

export async function fetchUsers(): Promise<(User & { 
  systemRoles: SystemRole[],
  assessmentUser: AssessmentUser[],
  assessmentCollectionUser: AssessmentCollectionUser[]
})[]> {
  return await db.user.findMany({include: { 
    systemRoles: true,
    assessmentUser: true,
    assessmentCollectionUser: true,
  }})
}

export async function fetchAssessmentTypes(): Promise<AssessmentType[]> {
  return await assessmentType.findMany({})
}

export async function fetchAssessmentType(typeid: string): Promise<AssessmentType | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessmentType.findUnique({ where: { id: idAsInteger } })
}

export async function fetchAssessmentCollections(typeid: string): Promise<AssessmentCollection[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessmentCollection.findMany({ where: { assessmentTypeId: idAsInteger } })
}

export async function fetchAllAssessments(): Promise<Assessment[]> {
  return await assessment.findMany({})
}

// Returns assessments in collections of given type
export async function fetchAssessments(typeid: string): Promise<Assessment[]> {
  const collections = await fetchAssessmentCollections(typeid)
  const collectionIds = collections.map((collection: AssessmentCollection) => collection.id)

  return await assessment.findMany({ where: { assessmentCollectionId: { in: collectionIds } } })
}

export async function fetchAssessment(assessmentId: string): Promise<Assessment | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessment.findUnique({ where: { id: idAsInteger } })
}

export async function fetchAssessmentUsers(assessmentId: string): Promise<(AssessmentUser & { user: User })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentUser.findMany({ where: { assessmentId: idAsInteger }, include: { user: true } })
}

export async function fetchAssessmentParticipants(assessmentId: string): Promise<(AssessmentUser & { user: User })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentUser.findMany({ where: { assessmentId: idAsInteger, role: "Participant" }, include: { user: true } })
}

export async function fetchUserResponses(userId: string | undefined): Promise<AssessmentUserResponse[]> {
  if(!userId) return []
  return await assessmentUserResponse.findMany({ where: { userId: parseInt(userId, 10) } })
}

export async function fetchAllResponsesForAssessment(assessmentId: string): Promise<AssessmentUserResponse[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }
  return await assessmentUserResponse.findMany({ where: { assessmentId: idAsInteger } })
}

export async function fetchUserResponsesForAssessment(userId: string | undefined, assessmentId: string): Promise<AssessmentUserResponse[]> {
  if(!userId) return []
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }
  return await assessmentUserResponse.findMany({ where: { 
    userId: parseInt(userId, 10), 
    assessmentId: idAsInteger
  } })
}

export async function fetchAllResponsesForAssessmentAttribute(assessmentId: string, attributeId: string): Promise<(AssessmentUserResponse & { user: User })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentUserResponse.findMany({ where: { assessmentId: idAsInteger, attributeId: attributeId }, include: { user: true } })
}

export async function fetchUserResponseForAssessmentAttribute(
  userId: string | undefined, 
  assessmentId: string,
  attributeId: string
): Promise<AssessmentUserResponse | undefined> {
  if(!userId) return undefined
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return undefined
  }
  const userResponses = await assessmentUserResponse.findMany({ where: { 
    userId: parseInt(userId, 10), 
    assessmentId: idAsInteger
  } })
  return userResponses.find(userResponse => userResponse.attributeId === attributeId)
}

export async function fetchPartsSectionsAttributes(typeid: string): Promise<(Part & { sections: (Section & { attributes: Attribute[] })[] })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await db.part.findMany({ where: { 
    assessmentTypeId: idAsInteger
  }, include: {
    sections: {
      include: {
        attributes: true
      }
    }
  } })
}

export async function fetchPart(typeid: string, partName: string): Promise<Part & { sections: (Section & { attributes: Attribute[] })[] } | null> {
  const parts = await fetchPartsSectionsAttributes(typeid)
  const uniquePart = parts.find(part => part.name === partName)
  if (uniquePart === undefined) {
    return null
  }
  return uniquePart
}

export async function fetchSection(sectionId: string): Promise<Section | null> {
  return await section.findUnique({ where: { id: sectionId } })
}

export async function fetchAttributes(sectionId: string): Promise<(Attribute & { levels: Level[] })[]> {
  return await db.attribute.findMany({ where: { sectionId: sectionId }, include: { levels: true } })
}

export async function fetchAttribute(attributeId: string): Promise<Attribute | null> {
  return await attribute.findUnique({ where: { id: attributeId } })
}

export async function fetchPreviousAttribute(typeid: string, attributeId: string): Promise<Attribute | null> {
  const assessmentParts = await fetchPartsSectionsAttributes(typeid)
  const attributes = assessmentParts.flatMap(part => part.sections.flatMap(section => section.attributes))
  const currentAttribute = attributes.find(attribute => attribute.id === attributeId)

  if (!currentAttribute) return null
  return attributes[attributes.indexOf(currentAttribute) - 1]
}

export async function fetchNextAttribute(typeid: string, attributeId: string): Promise<Attribute | null> {
  const assessmentParts = await fetchPartsSectionsAttributes(typeid)
  const attributes = assessmentParts.flatMap(part => part.sections.flatMap(section => section.attributes))
  const currentAttribute = attributes.find(attribute => attribute.id === attributeId)

  if (!currentAttribute) return null
  return attributes[attributes.indexOf(currentAttribute) + 1]
}

export async function fetchLevels(attributeId: string): Promise<Level[]> {
  return await level.findMany({ where: { attributeId: attributeId } })
}