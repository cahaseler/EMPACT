import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AssessmentAttribute,
  AssessmentPart,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Part,
  Section
} from "@/prisma/mssql/generated/client"
import PartRow from "./part-row"

export default function PartsTable({
  assessmentParts,
  assessmentAttributes,
  canEditStatus,
  assessmentUsers,
  userResponses
}: Readonly<{
  assessmentParts: (
    AssessmentPart & {
      part: Part & {
        sections: (Section & {
          attributes: Attribute[]
        })[]
      }
    }
  )[]
  assessmentAttributes: AssessmentAttribute[]
  canEditStatus: boolean
  assessmentUsers: (
    AssessmentUser & {
      participantParts: AssessmentPart[]
    }
  )[]
  userResponses: AssessmentUserResponse[]
}>) {
  const responseAttributeIds = userResponses.map(
    userResponse => userResponse.attributeId
  )
  const assessmentAttributeIds = assessmentAttributes.map(
    (assessmentAttribute) => assessmentAttribute.attributeId
  )
  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="table-fixed dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Part ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {canEditStatus &&
              <TableHead className="w-32">Actions</TableHead>
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessmentParts.map(
            (assessmentPart: AssessmentPart & { part: Part & { sections: (Section & { attributes: Attribute[] })[] } }) => {
              const partAttributeIds = assessmentPart.part.sections.flatMap(
                section => section.attributes.map(
                  attribute => attribute.id
                )
              )
              const partAttributesInAssessmentIds = partAttributeIds.filter(
                partAttributeId => assessmentAttributeIds.includes(partAttributeId)
              )
              const partResponseAttributeIds = responseAttributeIds.filter(
                responseAttributeId => partAttributesInAssessmentIds.includes(responseAttributeId)
              )
              const partParticipants = assessmentUsers.filter(
                assessmentUser =>
                  assessmentUser.role === "Participant" ||
                  assessmentUser.participantParts.some(
                    participantPart => participantPart.id === assessmentPart.id
                  )
              )
              const unfinishedPart =
                partAttributesInAssessmentIds.length * partParticipants.length !== partResponseAttributeIds.length
              return (
                <PartRow
                  key={assessmentPart.id}
                  assessmentId={assessmentPart.assessmentId}
                  assessmentPart={assessmentPart}
                  canEditStatus={canEditStatus}
                  unfinishedPart={unfinishedPart}
                />
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  )
}
