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
  AssessmentPart,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section,
  User
} from "@/prisma/mssql/generated/client"
import { sortAttributes } from "../../../../../../utils/dataCalculations"

type AssessmentUserWithResponses = AssessmentUser & {
  user: User & {
    assessmentUserResponse: (AssessmentUserResponse & {
      level: Level
    })[]
  },
}

export default function DataTable({
  groupId,
  part,
  attributes,
  assessmentUsers,
  groupTotalScore
}: Readonly<{
  groupId: number,
  part: Part,
  attributes: (Attribute & { levels: Level[], section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } })[],
  assessmentUsers: AssessmentUserWithResponses[],
  groupTotalScore: number | undefined
}>) {
  const attributeIds = attributes.map(attribute => attribute.id)
  const sortedAttributes = sortAttributes(attributes)

  const assessmentUsersWithResponses = assessmentUsers.filter(
    (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.some(
      (userResponse: AssessmentUserResponse & { level: Level }) => {
        return userResponse.assessmentId === assessmentUser.assessmentId &&
          userResponse.assessmentUserGroupId === groupId &&
          attributeIds.includes(userResponse.attributeId)
      }

    )
  )
  const [buttonDisplay, setButtonDisplay] = useState("Show")
  const [visibleUsers, setVisibleUsers] = useState(assessmentUsersWithResponses)
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          if (buttonDisplay === "Show") {
            setVisibleUsers(assessmentUsers);
            setButtonDisplay("Hide")
          } else {
            setVisibleUsers(assessmentUsersWithResponses);
            setButtonDisplay("Show")
          }
        }}>
          {buttonDisplay} Participants With No Responses
        </Button>
      </div>
      <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
        <Table className="table-fixed dark:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead className="w-36" />
              {sortedAttributes.map(
                (attribute: Attribute, key: number) => {
                  const attributeIdDisplay =
                    part.attributeType === "Attribute" ?
                      attribute.id.toUpperCase() :
                      attribute.id
                  return <TableHead key={key} className="w-12">{attributeIdDisplay}</TableHead>
                }
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleUsers.map(
              (assessmentUser: AssessmentUserWithResponses, key: number) => {
                return (
                  <TableRow key={key}>
                    <TableHead>{assessmentUser.user.lastName}, {assessmentUser.user.firstName}</TableHead>
                    {sortedAttributes.map(
                      (attribute: Attribute) => {
                        const attributeResponse = assessmentUser.user.assessmentUserResponse.find(
                          (userResponse: AssessmentUserResponse & { level: Level }) =>
                            userResponse.assessmentId === assessmentUser.assessmentId &&
                            userResponse.assessmentUserGroupId === groupId &&
                            userResponse.attributeId === attribute.id
                        )
                        if (attributeResponse) {
                          return <TableCell key={attribute.id}>{attributeResponse.level.level}</TableCell>
                        }
                        return <TableCell key={attribute.id}>--</TableCell>
                      }
                    )}
                  </TableRow>
                )
              })}
            {assessmentUsersWithResponses.length > 1 &&
              <TableRow>
                <TableHead className="font-bold">Average Rating</TableHead>
                {sortedAttributes.map(
                  (attribute: Attribute, key: number) => {
                    const attributeResponses = assessmentUsers.flatMap(
                      (assessmentUser: AssessmentUserWithResponses) => assessmentUser.user.assessmentUserResponse.filter(
                        (userResponse: AssessmentUserResponse & { level: Level }) =>
                          userResponse.assessmentId === assessmentUser.assessmentId &&
                          userResponse.assessmentUserGroupId === groupId &&
                          userResponse.attributeId === attribute.id
                      )
                    )
                    const average = Math.round(attributeResponses.reduce(
                      (total, attributeResponse) => total + attributeResponse.level.level, 0
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
          {(groupTotalScore && !isNaN(groupTotalScore)) ? groupTotalScore : "N/A"}
        </span>
      </div>
    </div>
  )
}