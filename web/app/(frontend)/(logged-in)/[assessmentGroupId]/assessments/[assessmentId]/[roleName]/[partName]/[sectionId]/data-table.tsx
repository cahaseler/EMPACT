"use client"
import { 
  AssessmentType, 
  Assessment,
  AssessmentAttribute, 
  Part, 
  Section, 
  Attribute, 
  Level,
  AssessmentUserResponse 
} from "@/prisma/mssql/generated/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useRouter } from "next/navigation"

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
    isParticipant
}: {
    assessment: Assessment & { assessmentAttributes: AssessmentAttribute[] }, 
    assessmentType: AssessmentType,
    role: string,
    part: Part,
    section: Section,
    attributes: (Attribute & { levels: Level[] })[],
    userResponses: AssessmentUserResponse[],
    isParticipant: boolean
}) {
  const router = useRouter()

  const assessmentAttributeIds = assessment.assessmentAttributes.map(assessmentAttribute => assessmentAttribute.attributeId)
  const attributesInAssessment = attributes.filter(attribute => assessmentAttributeIds.includes(attribute.id))
  
  return (
    <Table className="dark:bg-transparent">
      <TableHeader>
          <TableRow>
              <TableHead>{part.attributeType}</TableHead>
              {isParticipant ? 
                <>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comments</TableHead>
                </> : 
                <TableHead>Number of Submitted Responses</TableHead>
              }
          </TableRow>
      </TableHeader>
      <TableBody className="cursor-pointer">
          {attributesInAssessment.map((attribute: Attribute & { levels: Level[] }, key: number) => {
          const attributeResponses = userResponses.filter((userResponse: AssessmentUserResponse) => userResponse.attributeId === attribute.id)
          const level = attributeResponses.length > 0 ? attribute.levels.find((level: Level) => level.id === attributeResponses[0].levelId) : undefined
          return (
            <TableRow key={key} onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${attribute.id}`)
            }>
                <TableCell className="w-1/2">
                  {attribute.id.toString().toUpperCase()}. {attribute.name}
                </TableCell>
                {isParticipant ? 
                  <>
                    <TableCell className="w-20">
                      {level ? level.level : "---"}
                    </TableCell>
                    <TableCell>
                      {attributeResponses.length > 0 ? attributeResponses[0].notes : "---"}
                    </TableCell>
                  </> : 
                  <TableCell className="w-20">
                    {attributeResponses.length}
                  </TableCell>
                }
            </TableRow>
          )})}
      </TableBody>
    </Table>
  )
}