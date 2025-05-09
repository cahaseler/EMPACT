"use client"

import { useRouter } from "next/navigation"

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
  AssessmentType,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section
} from "@/prisma/mssql/generated/client"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  assessment,
  assessmentType,
  role,
  part,
  section,
  attributes,
  userResponses,
  isParticipant,
}: Readonly<{
  assessment: Assessment & { assessmentAttributes: AssessmentAttribute[] },
  assessmentType: AssessmentType,
  role: string,
  part: Part,
  section: Section,
  attributes: (Attribute & { levels: Level[] })[],
  userResponses: AssessmentUserResponse[],
  isParticipant: boolean
}>) {
  const router = useRouter()

  const assessmentAttributeIds = assessment.assessmentAttributes.map(assessmentAttribute => assessmentAttribute.attributeId)
  const attributesInAssessment = attributes.filter(attribute => assessmentAttributeIds.includes(attribute.id))
  const sortedAttributes = attributesInAssessment.sort((a, b) => {
    const aId = a.id.replace(".", "");
    const bId = b.id.replace(".", "");

    const aPart1 = aId.slice(1);
    const bPart1 = bId.slice(1);
    const aPart2 = aId.slice(0, 1);
    const bPart2 = bId.slice(0, 1);

    if (!isNaN(parseInt(aPart2, 10)) && !isNaN(parseInt(bPart2, 10))) {
      if (aPart1 < bPart1) return -1;
      if (aPart1 > bPart1) return 1;
      return parseInt(aPart2, 10) - parseInt(bPart2, 10);
    } else {
      if (aPart2 < bPart2) return -1;
      if (aPart2 > bPart2) return 1;
      return parseInt(aPart1, 10) - parseInt(bPart1, 10);
    }
  });

  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead>{part.attributeType}</TableHead>
            {isParticipant ?
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
                (userResponse: AssessmentUserResponse) => userResponse.attributeId === attribute.id
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
                  {isParticipant ? (
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
  )
}
