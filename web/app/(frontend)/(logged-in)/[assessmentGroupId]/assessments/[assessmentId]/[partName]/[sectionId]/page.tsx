import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSection, 
  fetchAttributes
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableResponses } from "../../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string 
  } 
}>) {
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attributes = await fetchAttributes(params.sectionId)

  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const userResponses = await viewableResponses(session, params.assessmentId)

  if (assessmentType && assessment && part && section) {
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
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-4 max-lg:ml-2">
          <Breadcrumbs links={links} currentPage={`${section.id.toString().toUpperCase()}. ${section.name}`} />
          <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">{section.id.toString().toUpperCase()}. {section.name}</h1>
              <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {section.description}
              </p>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <DataTable 
          assessment={assessment} 
          assessmentType={assessmentType} 
          part={part} section={section} 
          attributes={attributes} 
          userResponses={userResponses}
          isParticipant={isParticipant}
        />
      </section>
    </div>
  )
  }
}
