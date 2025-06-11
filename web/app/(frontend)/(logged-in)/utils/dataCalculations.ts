import {
  AssessmentPart,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section,
  User
} from "@/prisma/mssql/generated/client"

export function sortAttributes(
  attributes: (Attribute & {
    levels: Level[],
    section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
  })[]
) {
  return attributes.sort((a, b) => {
    const aId = a.id.replace(".", "")
    const bId = b.id.replace(".", "")

    const regex = /(\d+)|(\D+)/g;
    const aParts = aId.match(regex)
    const bParts = bId.match(regex)

    if (aParts && bParts) {
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || ""
        const bPart = bParts[i] || ""

        if (/\d/.test(aPart) && /\d/.test(bPart)) {
          const aNum = parseInt(aPart, 10)
          const bNum = parseInt(bPart, 10)
          if (aNum !== bNum) {
            return aNum - bNum
          }
        } else if (aPart !== bPart) {
          return aPart.localeCompare(bPart)
        }
      }
    }
    return 0
  })
}

export function calculateTotalScore(
  assessmentId: number,
  assessmentPartId: number,
  groupId: number,
  attributes: (Attribute & { levels: Level[] })[],
  assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    participantParts: AssessmentPart[]
  })[]
) {
  const attributeIds = attributes.map(attribute => attribute.id)
  const groupAssessmentUsers = assessmentUsers.filter((assessmentUser) => {
    return assessmentUser.assessmentUserGroupId === groupId ||
      assessmentUser.participantParts.some(
        (participantPart) => participantPart.id === assessmentPartId
      )
  })
  const responsesInPart = groupAssessmentUsers.flatMap(
    (assessmentUser: AssessmentUser & {
      user: User & {
        assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
      }
    }) => assessmentUser.user.assessmentUserResponse.filter(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          userResponse.assessmentUserGroupId === groupId &&
          attributeIds.includes(userResponse.attributeId)
      }

    )
  )
  const averages = attributes.map((attribute: Attribute & { levels: Level[] }) => {
    const attributeResponses = responsesInPart.filter(
      (userResponse: AssessmentUserResponse & { level: Level }) =>
        userResponse.attributeId === attribute.id
    )
    return (
      attributeResponses.reduce(
        (total, attributeResponse) => total + attributeResponse.level.weight, 0
      ) / attributeResponses.length
    )
  })
  const highestAttributeLevelWeights = attributes.flatMap(
    (attribute: Attribute & { levels: Level[] }) =>
      attribute.levels.filter(level => level.level === 5).map(level => level.weight)
  )
  const groupTotalScore = Math.round(
    averages.reduce(
      (total, average) => total + average, 0
    ) / highestAttributeLevelWeights.reduce(
      (total, weight) => total + weight, 0
    ) * 1000
  )
  return {
    assessmentId,
    assessmentPartId,
    assessmentUserGroupId: groupId,
    score: groupTotalScore
  }
}