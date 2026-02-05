"use client"

import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table"

import {
  AssessmentUser,
  AssessmentUserResponse,
  Level,
  User
} from "@/prisma/mssql/generated/client"

type AssessmentUserWithResponses = AssessmentUser & {
  user: User & {
    assessmentUserResponse: (AssessmentUserResponse & {
      level: Level
    })[]
  },
}

export default function GroupResultsDataTable({
  groupId,
  attributeIds,
  assessmentUsers,
  ratingsOrScores
}: Readonly<{
  groupId: number,
  attributeIds: string[],
  assessmentUsers: AssessmentUserWithResponses[]
  ratingsOrScores: "Ratings" | "Scores"
}>) {

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          userResponse.assessmentUserGroupId === groupId &&
          attributeIds.includes(userResponse.attributeId)
      }
    )
  )

  return (
    <TableBody>
      {assessmentUsersWithResponses.map(
        (assessmentUser: AssessmentUserWithResponses, key: number) => {
          return (
            <TableRow key={key}>
              <TableHead>{assessmentUser.user.lastName}, {assessmentUser.user.firstName}</TableHead>
              {attributeIds.map(
                (attributeId) => {
                  const attributeResponse = assessmentUser.user.assessmentUserResponse.find(
                    (userResponse: AssessmentUserResponse & { level: Level }) =>
                      userResponse.assessmentId === assessmentUser.assessmentId &&
                      userResponse.assessmentUserGroupId === groupId &&
                      userResponse.attributeId === attributeId
                  )
                  if (attributeResponse) {
                    return <TableCell key={attributeId}>
                      {ratingsOrScores === "Ratings" ? attributeResponse.level.level : attributeResponse.level.weight}
                    </TableCell>
                  }
                  return <TableCell key={attributeId}>--</TableCell>
                }
              )}
            </TableRow>
          )
        })}
      {assessmentUsersWithResponses.length > 1 &&
        <TableRow>
          <TableHead className="font-bold">Average</TableHead>
          {groupId === null && <TableCell>--</TableCell>}
          {attributeIds.map(
            (attributeId) => {
              const attributeResponses = assessmentUsers.flatMap(
                (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.filter(
                  (userResponse: AssessmentUserResponse & { level: Level }) =>
                    userResponse.assessmentId === assessmentUser.assessmentId &&
                    userResponse.assessmentUserGroupId === groupId &&
                    userResponse.attributeId === attributeId
                )
              )
              const average = Math.round(attributeResponses.reduce(
                (total, attributeResponse) => total + (ratingsOrScores === "Ratings" ?
                  attributeResponse.level.level :
                  attributeResponse.level.weight), 0
              ) / attributeResponses.length)
              return (
                <TableCell key={attributeId} className="font-bold">
                  {!isNaN(average) ? average : "--"}
                </TableCell>
              )
            }
          )}
        </TableRow>
      }
    </TableBody>
  )
}