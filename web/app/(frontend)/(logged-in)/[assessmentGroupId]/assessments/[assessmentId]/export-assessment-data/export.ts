import Excel from "exceljs"
import { saveAs } from "file-saver"

import {
  Assessment,
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Level,
  Part,
  ScoreSummary,
  User
} from "@/prisma/mssql/generated/client"

type AssessmentUserResponseData = AssessmentUserResponse & {
  user: User,
  assessmentUserGroup: AssessmentUserGroup | null,
  level: Level
}

const exportToExcel = (workbook: Excel.Workbook, fileName: string) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(blob, `${fileName}.xlsx`)
  });
};

export async function exportResponses({
  assessment,
  assessmentPart,
  attributeIds,
  responses
}: {
  readonly assessment: Assessment
  readonly assessmentPart: AssessmentPart & { part: Part }
  readonly attributeIds: string[]
  readonly responses: AssessmentUserResponseData[]
}) {
  const responsesWorkbook = new Excel.Workbook()

  attributeIds.forEach((attributeId) => {
    const attributeDisplayId = assessmentPart.part.attributeType === "Attribute" ? attributeId.toUpperCase() : attributeId

    const attributeWorksheet = responsesWorkbook.addWorksheet(attributeDisplayId)

    attributeWorksheet.columns = [
      { header: "Group", key: "group" },
      { header: "User ID", key: "userID" },
      { header: "Name", key: "name" },
      { header: "Rating", key: "rating" },
      { header: "Comments", key: "comments" },
    ]

    const attributeResponses = responses.filter((response) => response.attributeId === attributeId)

    attributeResponses.forEach((response) => {
      attributeWorksheet.addRow({
        group: response.assessmentUserGroup?.name || "N/A",
        userID: response.user.id,
        name: `${response.user.lastName}, ${response.user.firstName}`,
        rating: response.level.weight,
        comments: response.notes
      })
    })
  })

  const allAttributesWorksheet = responsesWorkbook.addWorksheet(`All ${assessmentPart.part.attributeType}s`)

  allAttributesWorksheet.columns = [
    { header: assessmentPart.part.attributeType, key: "attribute" },
    { header: "Group", key: "group" },
    { header: "User ID", key: "userID" },
    { header: "Name", key: "name" },
    { header: "Rating", key: "rating" },
    { header: "Comments", key: "comments" },
  ]

  responses.forEach((response) => {
    const attributeDisplayId = assessmentPart.part.attributeType === "Attribute" ? response.attributeId.toUpperCase() : response.attributeId

    allAttributesWorksheet.addRow({
      attribute: attributeDisplayId,
      group: response.assessmentUserGroup?.name || "N/A",
      userID: response.user.id,
      name: `${response.user.lastName}, ${response.user.firstName}`,
      rating: response.level.weight,
      comments: response.notes
    })
  })

  exportToExcel(responsesWorkbook, `${assessment.name} ${assessmentPart.part.name} Responses`)
}

function addGroupWorksheet(
  workbook: Excel.Workbook,
  group: AssessmentUserGroup,
  attributeIds: string[],
  attributeType: string,
  assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & {
        level: Level
      })[]
    }
  })[],
  ratingsOrScores: "Ratings" | "Scores",
  totalScores: ScoreSummary[]
) {
  const groupWorksheet = workbook.addWorksheet(group.name + " " + ratingsOrScores)

  groupWorksheet.columns = [
    { header: "Name", key: "name" },
    ...attributeIds.map((attributeId) => {
      const attributeDisplayId = attributeType === "Attribute" ? attributeId.toUpperCase() : attributeId
      return {
        header: attributeDisplayId,
        key: attributeId
      }
    })
  ]

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          userResponse.assessmentUserGroupId === group.id &&
          attributeIds.includes(userResponse.attributeId)
      }
    )
  )

  assessmentUsersWithResponses.forEach(
    (assessmentUser) => {
      const userRow = groupWorksheet.addRow({
        name: `${assessmentUser.user.lastName}, ${assessmentUser.user.firstName}`
      })
      attributeIds.forEach((attributeId) => {
        const attributeResponseLevel = assessmentUser.user.assessmentUserResponse.find((userResponse) => {
          return userResponse.assessmentId === assessmentUser.assessmentId &&
            userResponse.assessmentUserGroupId === group.id &&
            userResponse.attributeId === attributeId
        })?.level
        const attributeResponseLevelValue = ratingsOrScores === "Ratings" ?
          attributeResponseLevel?.level :
          attributeResponseLevel?.weight
        userRow.getCell(attributeId).value = attributeResponseLevelValue
      })
    }
  )

  if (assessmentUsersWithResponses.length > 1) {
    const averageRow = groupWorksheet.addRow({ name: "Average" })
    attributeIds.forEach((attributeId) => {
      const attributeResponses = assessmentUsers.flatMap(
        (assessmentUser) => assessmentUser.user.assessmentUserResponse.filter(
          (userResponse: AssessmentUserResponse & { level: Level }) =>
            userResponse.assessmentId === assessmentUser.assessmentId &&
            userResponse.assessmentUserGroupId === group.id &&
            userResponse.attributeId === attributeId
        )
      )
      const average = Math.round(attributeResponses.reduce(
        (total, attributeResponse) => total + (ratingsOrScores === "Ratings" ?
          attributeResponse.level.level :
          attributeResponse.level.weight), 0
      ) / attributeResponses.length)
      averageRow.getCell(attributeId).value = !isNaN(average) ? average : "--"
    })
  }

  const groupTotal = totalScores.find((scoreSummary) => scoreSummary.assessmentUserGroupId === group.id)
  groupWorksheet.addRow({
    name: "Total Score",
    [attributeIds[0] || ""]: groupTotal ? groupTotal.score : "--"
  })
}

function addAllGroupsWorksheet(
  workbook: Excel.Workbook,
  groups: AssessmentUserGroup[],
  attributeIds: string[],
  attributeType: string,
  assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & {
        level: Level
      })[]
    }
  })[],
  ratingsOrScores: "Ratings" | "Scores",
  totalScores: ScoreSummary[]
) {
  const allGroupsWorksheet = workbook.addWorksheet("All Groups " + ratingsOrScores)

  allGroupsWorksheet.columns = [
    { header: "Name", key: "name" },
    { header: "Group", key: "group" },
    ...attributeIds.map((attributeId) => {
      const attributeDisplayId = attributeType === "Attribute" ? attributeId.toUpperCase() : attributeId
      return {
        header: attributeDisplayId,
        key: attributeId
      }
    })
  ]

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          attributeIds.includes(userResponse.attributeId)
      }
    )
  )

  assessmentUsersWithResponses.forEach(
    (assessmentUser) => {
      const userGroup = groups.find((group) => group.id === assessmentUser.assessmentUserGroupId)
      if (userGroup) {
        const userRow = allGroupsWorksheet.addRow({
          name: `${assessmentUser.user.lastName}, ${assessmentUser.user.firstName}`,
          group: userGroup.name
        })
        attributeIds.forEach((attributeId) => {
          const attributeResponseLevel = assessmentUser.user.assessmentUserResponse.find((userResponse: AssessmentUserResponse & { level: Level }) =>
            userResponse.assessmentId === assessmentUser.assessmentId &&
            userResponse.assessmentUserGroupId === userGroup.id &&
            userResponse.attributeId === attributeId
          )?.level
          const attributeResponseLevelValue = ratingsOrScores === "Ratings" ?
            attributeResponseLevel?.level :
            attributeResponseLevel?.weight
          userRow.getCell(attributeId).value = attributeResponseLevelValue
        })
      }
      else {
        groups.map((group) => {
          const hasGroupResponses = assessmentUser.user.assessmentUserResponse.some(
            (userResponse: AssessmentUserResponse & { level: Level }) =>
              userResponse.assessmentId === assessmentUser.assessmentId &&
              userResponse.assessmentUserGroupId === group.id
          )
          if (hasGroupResponses) {
            const userRow = allGroupsWorksheet.addRow({
              name: `${assessmentUser.user.lastName}, ${assessmentUser.user.firstName}`,
              group: group.name
            })
            attributeIds.forEach((attributeId) => {
              const attributeResponseLevel = assessmentUser.user.assessmentUserResponse.find(
                (userResponse: AssessmentUserResponse & { level: Level }) =>
                  userResponse.assessmentId === assessmentUser.assessmentId &&
                  userResponse.assessmentUserGroupId === group.id &&
                  userResponse.attributeId === attributeId
              )?.level
              const attributeResponseLevelValue = ratingsOrScores === "Ratings" ?
                attributeResponseLevel?.level :
                attributeResponseLevel?.weight
              userRow.getCell(attributeId).value = attributeResponseLevelValue
            })
          }
        })
      }
    }
  )

  const averageRow = allGroupsWorksheet.addRow({
    name: "Average",
    group: "--"
  })
  attributeIds.forEach((attributeId) => {
    const attributeResponses = assessmentUsers.flatMap(
      (assessmentUser) => assessmentUser.user.assessmentUserResponse.filter(
        (userResponse: AssessmentUserResponse & { level: Level }) =>
          userResponse.assessmentId === assessmentUser.assessmentId &&
          userResponse.attributeId === attributeId
      )
    )
    const average = Math.round(attributeResponses.reduce(
      (total, attributeResponse) => total + (ratingsOrScores === "Ratings" ?
        attributeResponse.level.level :
        attributeResponse.level.weight), 0
    ) / attributeResponses.length)
    averageRow.getCell(attributeId).value = !isNaN(average) ? average : "--"
  })

  const averageTotalScore = Math.round(totalScores.reduce(
    (total, scoreSummary) => total + scoreSummary.score, 0
  ) / totalScores.length)
  allGroupsWorksheet.addRow({
    name: "Total Score",
    [attributeIds[0] || ""]: averageTotalScore || "--"
  })
}

export async function exportResults({
  assessmentName,
  assessmentPartName,
  groups,
  attributeType,
  attributeIds,
  assessmentUsers,
  totalScores
}: Readonly<{
  assessmentName: string,
  assessmentPartName: string,
  groups: AssessmentUserGroup[],
  attributeType: string,
  attributeIds: string[],
  assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & {
        level: Level
      })[]
    },
  })[],
  totalScores: ScoreSummary[]
}>) {
  const resultsWorkbook = new Excel.Workbook()

  groups.forEach(
    (group) => {
      addGroupWorksheet(resultsWorkbook, group, attributeIds, attributeType, assessmentUsers, "Ratings", totalScores)
      addGroupWorksheet(resultsWorkbook, group, attributeIds, attributeType, assessmentUsers, "Scores", totalScores)
    }
  )

  addAllGroupsWorksheet(resultsWorkbook, groups, attributeIds, attributeType, assessmentUsers, "Ratings", totalScores)
  addAllGroupsWorksheet(resultsWorkbook, groups, attributeIds, attributeType, assessmentUsers, "Scores", totalScores)

  exportToExcel(resultsWorkbook, `${assessmentName} ${assessmentPartName} Results`)
}