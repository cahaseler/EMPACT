import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart,
  fetchAssessmentParticipants
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableResponses } from "../../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import PartContent from "./part"

export default async function Page(
  props: Readonly<{ params: { 
      assessmentGroupId: string, 
      assessmentId: string, 
      roleName: string,
      partName: string 
    } }>
) {
  const params = await props.params;
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const assessmentParticipants = await fetchAssessmentParticipants(params.assessmentId)

  const isParticipant = params.roleName === "Participant"
  const numAssessmentUsers = isParticipant ? 1 : assessmentParticipants.length
  const userResponses = await viewableResponses(session, params.assessmentId, params.roleName)

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name
      }
    ]
    if (part) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={part.name} />
              <div className="flex flex-row justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">{part.name}</h1>
                    <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                      {part.description}
                    </p>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-16">
            <PartContent 
              assessment={assessment} 
              assessmentType={assessmentType} 
              part={part} 
              role={params.roleName}
              numAssessmentUsers={numAssessmentUsers}
              userResponses={userResponses} 
            />
          </section>
        </div>
      )
    }
  }
}
