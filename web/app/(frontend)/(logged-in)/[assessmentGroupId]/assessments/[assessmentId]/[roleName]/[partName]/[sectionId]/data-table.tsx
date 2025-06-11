"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  Assessment,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentType,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section
} from "@/prisma/mssql/generated/client"
import { sortAttributes } from "../../../../../../utils/dataCalculations"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  assessment,
  assessmentType,
  groups,
  role,
  part,
  section,
  attributes,
  userResponses,
  isParticipating,
  isFacilitator
}: Readonly<{
  assessment: Assessment & { assessmentAttributes: AssessmentAttribute[] },
  assessmentType: AssessmentType,
  groups: AssessmentUserGroup[],
  role: string,
  part: Part,
  section: Section,
  attributes: (Attribute & {
    levels: Level[],
    section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
  })[],
  userResponses: AssessmentUserResponse[],
  isParticipating: boolean
  isFacilitator: boolean
}>) {
  const [groupId, setGroupId] = useState<number | null>(groups[0] ? groups[0].id : null)

  const router = useRouter()

  const assessmentAttributeIds = assessment.assessmentAttributes.map(assessmentAttribute => assessmentAttribute.attributeId)
  const attributesInAssessment = attributes.filter(attribute => assessmentAttributeIds.includes(attribute.id))
  const sortedAttributes = sortAttributes(attributesInAssessment)

  return (
    <div className="flex flex-col space-y-4">
      {isFacilitator &&
        <div className="w-full flex flex-col items-end">
          <div className="flex flex-col space-y-2 w-1/3 sm:w-1/4">
            <Select
              onValueChange={(value) => {
                setGroupId(parseInt(value, 10))
              }}
            >
              <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                <SelectValue
                  placeholder={groups[0] ? groups[0].name : "Select Group"}
                  defaultValue={groups[0] && groups[0].id}
                />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem value={group.id.toString()} key={group.id}>
                    {group.name.toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-right">
              User Group
            </Label>
          </div>
        </div>
      }
      <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
        <Table className="dark:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead>{part.attributeType}</TableHead>
              {isParticipating ?
                (
                  <>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="w-28">Number of Submitted Responses</TableHead>
                    <TableHead>Average Rating</TableHead>
                  </>
                )
              }
            </TableRow>
          </TableHeader>
          <TableBody className="cursor-pointer">
            {sortedAttributes.map(
              (attribute: Attribute & { levels: Level[] }, key: number) => {
                const attributeResponses = userResponses.filter(
                  (userResponse: AssessmentUserResponse) => {
                    if (isParticipating && isFacilitator) {
                      return userResponse.attributeId === attribute.id && userResponse.assessmentUserGroupId === groupId
                    }
                    return userResponse.attributeId === attribute.id
                  }
                )
                const attributeResponseLevels = attributeResponses.map(
                  (attributeResponse: AssessmentUserResponse) => attributeResponse.levelId
                )
                const attributeIdDisplay =
                  part.attributeType === "Attribute" ?
                    attribute.id.toUpperCase() :
                    attribute.id
                const levels = attribute.levels.filter(
                  (level: Level) => attributeResponseLevels.includes(level.id)
                ).map(
                  (level: Level) => level.level
                )
                const averageLevel = levels.reduce((a, b) => a + b, 0) / levels.length
                const urlAttributeId = attribute.id.replace(".", "")
                return (
                  <TableRow
                    key={key}
                    onClick={() =>
                      router.push(
                        `/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${urlAttributeId}`
                      )
                    }
                  >
                    <TableCell className="w-1/2">
                      {attributeIdDisplay}. {attribute.name}
                    </TableCell>
                    {isParticipating ? (
                      <>
                        <TableCell className="w-20">
                          {levels.length > 0 ? levels[0] : "---"}
                        </TableCell>
                        <TableCell>
                          {attributeResponses.length > 0
                            ? attributeResponses[0]?.notes
                            : "---"}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="w-20">
                          {attributeResponses.length}
                        </TableCell>
                        <TableCell className="w-20">
                          {averageLevel || "---"}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
