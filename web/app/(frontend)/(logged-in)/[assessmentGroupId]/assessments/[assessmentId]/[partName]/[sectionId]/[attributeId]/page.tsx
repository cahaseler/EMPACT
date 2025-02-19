import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSection, 
  fetchAttribute,
  fetchPreviousAttribute,
  fetchNextAttribute,
  fetchLevels
} from "../../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableAttributeResponses } from "../../../../../../utils/permissions"

import { Card } from "@/components/ui/card"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import AttributeContent from "./attributeContent"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string,
    attributeId: string 
  } 
}>) {
  const session = await auth()
  
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attribute = await fetchAttribute(params.attributeId)
  const prevAttribute = await fetchPreviousAttribute(params.assessmentGroupId, params.attributeId)
  const nextAttribute = await fetchNextAttribute(params.assessmentGroupId, params.attributeId)
  const levels = await fetchLevels(params.attributeId)
  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const userResponses = await viewableAttributeResponses(session, params.assessmentId, params.attributeId)

  if (assessmentType && assessment && part && section && attribute) {
    const links = [
      {
          url: `/${assessmentType.id}/assessments`, 
          name: assessmentType.name
      },
      {
          url: `/${assessmentType.id}/assessments/${assessment.id}`, 
          name: assessment.name
      },
      {
          url: `/${assessmentType.id}/assessments/${assessment.id}/${part.name}`, 
          name: part.name
      },
      {
          url: `/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}`,
          name: `${section.id.toString().toUpperCase()}. ${section.name}`
        }
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={part.attributeType + " " + attribute.id.toString().toUpperCase()} />
            <h1 
              className="text-3xl font-bold tracking-tighter" 
              dangerouslySetInnerHTML={{ __html: attribute.id.toString().toUpperCase() + ". " + attribute.name }} 
            />
            <Card className="bg-white max-h-60 overflow-auto px-6 py-1">
              <div 
                className="text-sm text-description text-muted-foreground dark:text-indigo-300/80" 
                dangerouslySetInnerHTML={{ __html: attribute.description }} 
              />
            </Card>
          </div>
        </section>
        <AttributeContent 
          assessment={assessment} 
          assessmentType={assessmentType} 
          part={part} 
          section={section} 
          attribute={attribute}
          prevAttribute={prevAttribute}
          nextAttribute={nextAttribute} 
          levels={levels} 
          userId={session?.user?.id}
          isParticipant={isParticipant}
          userResponses={userResponses}
        />
      </div>
    )
  }
}
