import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
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
  return (
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
            const partResponseAttributeIds = responseAttributeIds.filter(
              responseAttributeId => partAttributeIds.includes(responseAttributeId)
            )
            const partParticipants = assessmentUsers.filter(
              assessmentUser =>
                assessmentUser.role === "Participant" ||
                assessmentUser.participantParts.some(
                  participantPart => participantPart.id === assessmentPart.id
                )
            )
            const unfinishedPart =
              partAttributeIds.length * partParticipants.length !== partResponseAttributeIds.length * partParticipants.length
            return (
              <PartRow
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
  )
}
