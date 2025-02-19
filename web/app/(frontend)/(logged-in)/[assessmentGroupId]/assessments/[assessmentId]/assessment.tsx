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

export default function AssessmentContent({
  assessment, 
  assessmentType,
  parts,
  numAssessmentUsers,
  userResponses
}: Readonly<{
  assessment: Assessment, 
  assessmentType: AssessmentType,
  parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[],
  numAssessmentUsers: number,
  userResponses: AssessmentUserResponse[]
}>) {
  const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
  return (
    <div className="w-full flex flex-col space-y-4">
      {parts.map((part: Part & { sections: (Section & { attributes: Attribute[] })[] }, key: number) => {
        const partAttributeIds = part.sections.flatMap(section => section.attributes.map(attribute => attribute.id))
        const partResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => partAttributeIds.includes(responseAttributeId))
        const unfinishedPart = partAttributeIds.length * numAssessmentUsers !== partResponseAttributeIds.length * numAssessmentUsers
        return (
          <Link
            key={key}
            href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}`}
            prefetch={false}
          >
            <Button size="xl">
              <div className="flex flex-col w-full space-y-2">
                <h2 className="text-xl font-bold text-indigo-50">
                  {part.name}
                </h2>
                <h3 className="text-lg font-semibold text-indigo-200">
                  Status: {unfinishedPart ? "In Progress" : "Completed"}
                </h3>
              </div>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}