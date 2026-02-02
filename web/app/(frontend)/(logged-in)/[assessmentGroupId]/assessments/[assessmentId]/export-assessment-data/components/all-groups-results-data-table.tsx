"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Level,
  Part,
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
  attributeType,
  attributeIds,
  assessmentUsers,
  totalScore
}: Readonly<{
  groups: AssessmentUserGroup[],
  attributeType: string,
  attributeIds: string[],
  assessmentUsers: AssessmentUserWithResponses[],
  totalScore: number | undefined
}>) {

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          attributeIds.includes(userResponse.attributeId)
      }
    )
  )

  const [ratingsOrScores, setRatingsOrScores] = useState<"Ratings" | "Scores">("Ratings")

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full flex flex-row justify-end">
        <Button
          className="rounded-r-none"
          onClick={() => setRatingsOrScores("Ratings")}
          disabled={ratingsOrScores === "Ratings"}
        >
          Ratings
        </Button>
        <Button
          className="rounded-l-none"
          onClick={() => setRatingsOrScores("Scores")}
          disabled={ratingsOrScores === "Scores"}
        >
          Scores
        </Button>
      </div>
      <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
        <Table className="table-fixed h-20 overflow-y-auto dark:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Name</TableHead>
              <TableHead className="w-36">Group</TableHead>
              {attributeIds.map(
                (attributeId: string, key: number) => {
                  const attributeIdDisplay =
                    attributeType === "Attribute" ?
                      attributeId.toUpperCase() :
                      attributeId
                  return <TableHead key={key} className="w-12">{attributeIdDisplay}</TableHead>
                }
              )}
            </TableRow>
          </TableHeader>
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
        </Table>
      </div>
      <div className="w-full grid grid-cols-3">
        <span className="ml-4 text-base font-bold text-indigo-900/70 dark:text-indigo-100/70">
          Total Score
        </span>
        <span className="text-2xl text-center font-bold text-indigo-700 dark:text-indigo-300">
          {(totalScore && !isNaN(totalScore)) ? totalScore : "N/A"}
        </span>
      </div>
    </div>
  )
}