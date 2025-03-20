import { 
  AssessmentType, 
  Assessment,
  AssessmentPart,
  AssessmentAttribute,
  AssessmentUser, 
  AssessmentUserResponse, 
  Part, 
  Section, 
  Attribute 
} from "@/prisma/mssql/generated/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PartContent({
    assessment, 
    assessmentType,
    role,
    part,
    assessmentUsers,
    userResponses,
    isParticipant
}: {
    assessment: Assessment & { assessmentAttributes: AssessmentAttribute[] }, 
    assessmentType: AssessmentType,
    role: string,
    part: Part & { sections: (Section & { attributes: Attribute[] })[] },
    assessmentUsers: (AssessmentUser & { participantParts: AssessmentPart[]})[],
    userResponses: AssessmentUserResponse[],
    isParticipant: boolean
}) {
  const assessmentAttributeIds = assessment.assessmentAttributes.map(assessmentAttribute => assessmentAttribute.attributeId)
  const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
  const partParticipants = assessmentUsers.filter(assessmentUser => assessmentUser.role === "Participant" || assessmentUser.participantParts.some(participantPart => participantPart.partId === part.id))
  const numParticipants = isParticipant ? 1 : partParticipants.length
  return (
    <div className="flex flex-col space-y-2">
      {part.sections.map((section: Section & { attributes: Attribute[] }, key: number) => {
        const sectionAttributesInAssessment = section.attributes.filter(attribute => assessmentAttributeIds.includes(attribute.id))
        const sectionAttributeIds = sectionAttributesInAssessment.map(attribute => attribute.id)
        const sectionResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => sectionAttributeIds.includes(responseAttributeId))
        const unfinishedSection = sectionAttributeIds.length * numParticipants !== sectionResponseAttributeIds.length * numParticipants
        return (
          <Link
            key={key}
            href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}`}
            prefetch={false}
          >
            <Button size="xl">
              <div className="w-full flex flex-col space-y-2">
                <h2 className="text-xl font-bold text-indigo-50">
                  {section.id.toString().toUpperCase()}. {section.name}
                </h2>
                <h3 className="text-lg font-semibold text-indigo-200">
                  Status: {unfinishedSection ? "In Progress" : "Completed"}
                </h3>
              </div>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}