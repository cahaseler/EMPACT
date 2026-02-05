"use client"

import {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@/components/ui/table"

import {
  AssessmentUser,
  AssessmentUserGroup,
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

export default function ResultsDataTable({
  groups,
  attributeIds,
  assessmentUsers,
  ratingsOrScores
}: Readonly<{
  groups: AssessmentUserGroup[]
  attributeIds: string[],
  assessmentUsers: AssessmentUserWithResponses[]
  ratingsOrScores: "Ratings" | "Scores"
}>) {

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          attributeIds.includes(userResponse.attributeId)
      }
    )
  )

  return (
    <TableBody>
      {assessmentUsersWithResponses.map(
        (assessmentUser: AssessmentUserWithResponses, key: number) => {
          const userGroup = groups?.find(group => group.id === assessmentUser.assessmentUserGroupId)
          if (userGroup) return (
            <TableRow key={key}>
              <TableHead>{assessmentUser.user.lastName}, {assessmentUser.user.firstName}</TableHead>
              <TableCell>
                {groups?.find(group => group.id === assessmentUser.assessmentUserGroupId)?.name}
              </TableCell>
              {attributeIds.map(
                (attributeId: string) => {
                  const attributeResponse = assessmentUser.user.assessmentUserResponse.find(
                    (userResponse: AssessmentUserResponse & { level: Level }) =>
                      userResponse.assessmentId === assessmentUser.assessmentId &&
                      userResponse.assessmentUserGroupId === userGroup.id &&
                      userResponse.attributeId === attributeId
                  )
                  if (attributeResponse) {
                    return <TableCell key={attributeId}>
                      {ratingsOrScores === "Ratings" ? attributeResponse.level.level : attributeResponse.level.weight}
                    </TableCell>
                  }
                  else return <TableCell key={attributeId}>--</TableCell>
                }
              )}
            </TableRow>
          )
          else return (
            groups?.map(group => {
              const responsesForGroup = assessmentUser.user.assessmentUserResponse.some(
                (userResponse: AssessmentUserResponse & { level: Level }) =>
                  userResponse.assessmentId === assessmentUser.assessmentId &&
                  userResponse.assessmentUserGroupId === group.id
              )
              if (responsesForGroup) {
                return (
                  <TableRow key={key}>
                    <TableHead>{assessmentUser.user.lastName}, {assessmentUser.user.firstName}</TableHead>
                    <TableCell>
                      {group.name}
                    </TableCell>
                    {attributeIds.map(
                      (attributeId: string) => {
                        const attributeResponse = assessmentUser.user.assessmentUserResponse.find(
                          (userResponse: AssessmentUserResponse & { level: Level }) =>
                            userResponse.assessmentId === assessmentUser.assessmentId &&
                            userResponse.assessmentUserGroupId === group.id &&
                            userResponse.attributeId === attributeId
                        )
                        if (attributeResponse) {
                          return <TableCell key={attributeId}>
                            {ratingsOrScores === "Ratings" ? attributeResponse.level.level : attributeResponse.level.weight}
                          </TableCell>
                        }
                        else return <TableCell key={attributeId}>--</TableCell>
                      }
                    )}
                  </TableRow>
                )
              }
            })
          )
        })}
      {assessmentUsersWithResponses.length > 1 &&
        <TableRow>
          <TableHead className="font-bold">Average</TableHead>
          <TableCell>--</TableCell>
          {attributeIds.map(
            (attributeId: string, key: number) => {
              const attributeResponses = assessmentUsers.flatMap(
                (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.filter(
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
              return (
                <TableCell key={key} className="font-bold">
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