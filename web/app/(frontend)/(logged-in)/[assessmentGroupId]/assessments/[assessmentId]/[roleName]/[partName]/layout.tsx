import { 
  fetchAssessmentType, 
  fetchAssessment,
  fetchPart,
  fetchAssessmentParticipants
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
  isAdmin, 
  isManagerForCollection, 
  isLeadForAssessment, 
  isFacForAssessment,
  canUserParticipateInPart,
  viewableParts,
  viewableResponses
} from "../../../../../utils/permissions"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AssessmentSidebar } from "@/app/(frontend)/components/assessment-sidebar"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
  
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: { 
    assessmentGroupId: string,
    assessmentId: string,
    roleName: string,
    partName: string
  }
}>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const parts = await viewableParts(session, params.assessmentGroupId, params.assessmentId, params.roleName)
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
        },
    ]
    if (part) {
      const canViewAsFac = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment?.assessmentCollectionId) || 
        isLeadForAssessment(session, params.assessmentId) ||
        isFacForAssessment(session, params.assessmentId)
      const canViewAsParticipant = canUserParticipateInPart(session, params.assessmentId, part.id)
      const facAuthorized = params.roleName === "Facilitator" && canViewAsFac
      const participantAuthorized = params.roleName === "Participant" && canViewAsParticipant
      if (facAuthorized || participantAuthorized) {
        return (
          <SidebarProvider defaultOpen={false}>
            <AssessmentSidebar 
              assessmentType={assessmentType} 
              assessment={assessment} 
              role={params.roleName}
              parts={parts} 
              numAssessmentUsers={numAssessmentUsers}
              userResponses={userResponses} 
            />
            {children}
          </SidebarProvider>
        )
      }
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={part.name} />
              <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                You are not authorized to view this page.
              </p>
            </div>
          </section>
        </div>
      )
    }
    return <NotFound links={links} pageType="part" />
  }
}