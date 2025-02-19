import { 
  AssessmentType, 
  Assessment, 
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
    part,
    numAssessmentUsers,
    userResponses
}: {
    assessment: Assessment, 
    assessmentType: AssessmentType,
    part: Part & { sections: (Section & { attributes: Attribute[] })[] },
    numAssessmentUsers: number,
    userResponses: AssessmentUserResponse[]
}) {
  const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
  return (
    <div className="flex flex-col space-y-2">
      {part.sections.map((section: Section & { attributes: Attribute[] }, key: number) => {
        const sectionAttributeIds = section.attributes.map(attribute => attribute.id)
        const sectionResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => sectionAttributeIds.includes(responseAttributeId))
        const unfinishedSection = sectionAttributeIds.length * numAssessmentUsers !== sectionResponseAttributeIds.length * numAssessmentUsers
        return (
          <Link
            key={key}
            href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}`}
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