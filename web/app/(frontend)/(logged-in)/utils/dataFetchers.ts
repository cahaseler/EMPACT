"use server"
import * as assessment from "@/app/utils/assessment"
import * as assessmentType from "@/app/utils/assessmentType"
import * as assessmentUserResponse from "@/app/utils/assessmentUserResponse"
import * as level from "@/app/utils/level"
import * as section from "@/app/utils/section"
import { db } from "@/lib/db"
import {
  Assessment,
  AssessmentAttribute,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentPart,
  AssessmentType,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Permission,
  Section,
  SystemRole,
  User,
} from "@/prisma/mssql/generated/client"
import { sortAttributes } from "./dataCalculations"

// *** USERS ***

export async function fetchUsers(): Promise<
  (User & {
    systemRoles: SystemRole[]
    assessmentUser: AssessmentUser[]
    assessmentCollectionUser: AssessmentCollectionUser[]
  })[]
> {
  return await db.user.findMany({
    include: {
      systemRoles: true,
      assessmentUser: true,
      assessmentCollectionUser: true,
    },
  })
}

// *** ASSESSMENT TYPES ***

export async function fetchAssessmentTypes(): Promise<AssessmentType[]> {
  return await assessmentType.findMany({})
}

export async function fetchAssessmentType(
  typeid: string
): Promise<AssessmentType | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }

  return await assessmentType.findUnique({ where: { id: idAsInteger } })
}

// *** ASSESSMENT COLLECTIONS ***

export async function fetchAssessmentCollections(typeid: string): Promise<
  (AssessmentCollection & {
    assessments: (Assessment & {
      assessmentParts: AssessmentPart[],
      assessmentUser: (AssessmentUser & { user: User })[],
      assessmentAttributes: AssessmentAttribute[]
    })[]
    assessmentCollectionUser: (AssessmentCollectionUser & { user: User })[]
  })[]
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentCollection.findMany({
    where: { assessmentTypeId: idAsInteger },
    include: {
      assessments: {
        include: {
          assessmentParts: true,
          assessmentUser: {
            include: {
              user: true,
            },
          },
          assessmentAttributes: true
        },
      },
      assessmentCollectionUser: {
        include: {
          user: true,
        },
      },
    },
  })
}

export async function fetchAssessmentCollection(collectionId: string): Promise<
  | (AssessmentCollection & {
    assessmentCollectionUser: (AssessmentCollectionUser & { user: User })[]
  })
  | null
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(collectionId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }

  return await db.assessmentCollection.findUnique({
    where: { id: idAsInteger },
    include: { assessmentCollectionUser: { include: { user: true } } },
  })
}

// *** ASSESSMENTS ***

export async function fetchAllAssessments(): Promise<Assessment[]> {
  return await assessment.findMany({})
}

// Returns assessments in collections of given type
export async function fetchAssessments(
  typeid: string
): Promise<(Assessment & { assessmentParts: AssessmentPart[], assessmentUser: (AssessmentUser & { user: User })[], assessmentAttributes: AssessmentAttribute[] })[]> {
  const collections = await fetchAssessmentCollections(typeid)
  return collections.flatMap((collection) => collection.assessments)
}

export async function fetchAssessment(assessmentId: string): Promise<
  (Assessment & {
    assessmentParts: (AssessmentPart & { part: Part })[],
    assessmentAttributes: (AssessmentAttribute & { attribute: Attribute & { levels: Level[], section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } })[]
  }) | null
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }

  return await db.assessment.findUnique({
    where: { id: idAsInteger },
    include: {
      assessmentParts: { include: { part: true } },
      assessmentAttributes: {
        include: {
          attribute: {
            include: {
              levels: true,
              section: { include: { part: { include: { assessmentPart: true } } } }
            }
          }
        }
      }
    }
  })
}

// *** ASSESSMENT USER GROUPS ***

export async function fetchAssessmentUserGroups(assessmentId: string): Promise<
  (AssessmentUserGroup & {
    assessmentUser: (AssessmentUser & {
      user: User & {
        assessmentUserResponse: (AssessmentUserResponse & { user: User, level: Level })[]
      }
    })[]
  })[]
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentUserGroup.findMany({
    where: { assessmentId: idAsInteger },
    include: {
      assessmentUser: {
        include: {
          user: {
            include: {
              assessmentUserResponse: { include: { user: true, level: true } }
            }
          }
        }
      }
    },
  })
}

export async function fetchAssessmentUserGroup(groupId: number | null | undefined): Promise<AssessmentUserGroup | null> {
  if (!groupId) return null
  return await db.assessmentUserGroup.findUnique({ where: { id: groupId } })
}

export async function fetchPermissions(): Promise<Permission[]> {
  return await db.permission.findMany({})
}

// *** ASSESSMENT USERS ***

export async function fetchAssessmentUser(assessmentUserId: string): Promise<
  | (AssessmentUser & {
    user: User & { assessmentUserResponse: AssessmentUserResponse[] }
    permissions: Permission[]
    participantParts: (AssessmentPart & { part: Part })[]
  })
  | null
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentUserId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }

  return await db.assessmentUser.findUnique({
    where: { id: idAsInteger },
    include: {
      user: {
        include: {
          assessmentUserResponse: true,
        },
      },
      permissions: true,
      participantParts: {
        include: {
          part: true,
        },
      },
    },
  })
}

export async function fetchAssessmentUsers(assessmentId: string): Promise<
  (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    assessmentUserGroup: AssessmentUserGroup | null,
    participantParts: AssessmentPart[],
    permissions: Permission[]
  })[]
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentUser.findMany({
    where: { assessmentId: idAsInteger },
    include: {
      user: {
        include: {
          assessmentUserResponse: {
            include: { level: true }
          }
        }
      },
      assessmentUserGroup: true,
      participantParts: true,
      permissions: true
    }
  })
}

// *** ASSESSMENT USER RESPONSES ***

export async function fetchUserResponses(userId: string | undefined): Promise<AssessmentUserResponse[]> {
  if (!userId) return []
  return await assessmentUserResponse.findMany({ where: { userId: parseInt(userId, 10) } })
}

export async function fetchAllResponsesForAssessment(
  assessmentId: string
): Promise<AssessmentUserResponse[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await assessmentUserResponse.findMany({
    where: { assessmentId: idAsInteger },
  })
}

export async function fetchUserResponsesForAssessment(
  userId: string | undefined,
  assessmentId: string
): Promise<AssessmentUserResponse[]> {
  if (!userId) return []
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await assessmentUserResponse.findMany({
    where: {
      userId: parseInt(userId, 10),
      assessmentId: idAsInteger,
    },
  })
}

export async function fetchAllResponsesForAssessmentAttribute(
  assessmentId: string,
  attributeId: string
): Promise<(AssessmentUserResponse & { user: User, level: Level })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentUserResponse.findMany({
    where: { assessmentId: idAsInteger, attributeId: attributeId },
    include: { user: true, level: true },
  })
}

export async function fetchUserResponsesForAssessmentAttribute(
  userId: string | undefined,
  assessmentId: string,
  attributeId: string
): Promise<(AssessmentUserResponse)[]> {
  if (!userId) return []
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentUserResponse.findMany({
    where: { assessmentId: idAsInteger, userId: parseInt(userId, 10), attributeId: attributeId }
  })
}

export async function fetchUserResponseForAssessmentAttribute(
  userId: string | undefined,
  assessmentId: string,
  assessmentUserGroupId: number,
  attributeId: string
): Promise<AssessmentUserResponse | null> {
  if (!userId) return null
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }
  return await db.assessmentUserResponse.findUnique({
    where: {
      assessmentId_userId_assessmentUserGroupId_attributeId: {
        assessmentId: idAsInteger,
        userId: parseInt(userId, 10),
        assessmentUserGroupId,
        attributeId
      }
    }
  })
}

// *** ASSESSMENT PARTS ***

export async function fetchAssessmentParts(assessmentId: string): Promise<
  (AssessmentPart & {
    part: Part & { sections: (Section & { attributes: Attribute[] })[] }
  })[]
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentPart.findMany({
    where: { assessmentId: idAsInteger },
    include: {
      part: {
        include: {
          sections: {
            include: {
              attributes: true,
            },
          },
        },
      },
    },
  })
}

export async function fetchAssessmentPart(assessmentId: number, partId: number): Promise<AssessmentPart | null> {
  return await db.assessmentPart.findUnique({
    where: {
      assessmentId_partId: {
        assessmentId,
        partId
      }
    }
  })
}

// *** ASSESSMENT ATTRIBUTES ***

export async function fetchAssessmentAttributes(assessmentId: string): Promise<(
  AssessmentAttribute & { attribute: Attribute & { levels: Level[], section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } }
)[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentAttribute.findMany({
    where: { assessmentId: idAsInteger },
    include: {
      attribute: {
        include: {
          levels: true,
          section: {
            include: {
              part: {
                include: {
                  assessmentPart: true
                }
              }
            }
          }
        }
      }
    }
  })
}

export async function fetchAssessmentAttribute(assessmentId: string, attributeId: string): Promise<
  AssessmentAttribute & { attribute: Attribute } | null
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return null
  }
  return await db.assessmentAttribute.findUnique({
    where: {
      assessmentId_attributeId: { assessmentId: idAsInteger, attributeId }
    }, include: { attribute: true }
  })
}

// *** PARTS ***

export async function fetchPartsSectionsAttributes(typeid: string): Promise<
  (Part & {
    sections: (Section & {
      attributes: (Attribute & {
        levels: Level[],
        section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
      })[]
    })[]
  })[]
> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if (isNaN(idAsInteger)) {
    return []
  }

  return await db.part.findMany({
    where: {
      assessmentTypeId: idAsInteger,
    },
    include: {
      sections: {
        include: {
          attributes: {
            include: {
              levels: true,
              section: {
                include: {
                  part: {
                    include: {
                      assessmentPart: true
                    }
                  }
                }
              }
            }
          },
        },
      },
    },
  })
}

export async function fetchPart(
  typeid: string,
  partName: string
): Promise<
  (Part & {
    sections: (Section & {
      attributes: (Attribute & {
        levels: Level[],
        section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
      })[]
    })[]
  }) | null
> {
  const parts = await fetchPartsSectionsAttributes(typeid)
  const uniquePart = parts.find((part) => part.name === partName)
  if (uniquePart === undefined) {
    return null
  }
  return uniquePart
}

// *** SECTIONS ***

export async function fetchSection(sectionId: string): Promise<Section | null> {
  return await section.findUnique({ where: { id: sectionId } })
}

// *** ATTRIBUTES ***

export async function fetchAttributes(
  sectionId: string
): Promise<(Attribute & {
  levels: Level[],
  section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
})[]> {
  return await db.attribute.findMany({
    where: { sectionId: sectionId },
    include: {
      levels: true,
      section: {
        include: {
          part: {
            include: {
              assessmentPart: true
            }
          }
        }
      }
    },
  })
}

export async function fetchPreviousAttribute(assessmentId: string, partName: string, attributeId: string): Promise<
  Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null
> {
  const attributes = await fetchAssessmentAttributes(assessmentId)
  const attributesInPart = attributes.filter(
    attribute => attribute.attribute.section.part.name === partName
  ).map(attribute => attribute.attribute)
  const sortedAttributes = sortAttributes(attributesInPart)
  const currentAttributeIndex = sortedAttributes.findIndex(attribute => attribute.id === attributeId)

  // Check if current attribute exists and if there is a previous attribute (index > 0)
  if (currentAttributeIndex === -1 || currentAttributeIndex === 0) return null

  // Safely access the previous attribute
  const previousAssessmentAttribute = sortedAttributes[currentAttributeIndex - 1];
  return previousAssessmentAttribute ?? null;
}

export async function fetchNextAttribute(assessmentId: string, partName: string, attributeId: string): Promise<
  Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null
> {
  const attributes = await fetchAssessmentAttributes(assessmentId)
  const attributesInPart = attributes.filter(
    attribute => attribute.attribute.section.part.name === partName
  ).map(attribute => attribute.attribute)
  const sortedAttributes = sortAttributes(attributesInPart)
  const currentAttributeIndex = sortedAttributes.findIndex(attribute => attribute.id === attributeId)

  // Check if current attribute exists and if there is a next attribute (index < length - 1)
  if (currentAttributeIndex === -1 || currentAttributeIndex >= sortedAttributes.length - 1) return null

  // Safely access the next attribute
  const nextAssessmentAttribute = sortedAttributes[currentAttributeIndex + 1];
  return nextAssessmentAttribute ?? null;
}

// *** LEVELS ***

export async function fetchLevels(attributeId: string): Promise<Level[]> {
  return await level.findMany({ where: { attributeId: attributeId } })
}
