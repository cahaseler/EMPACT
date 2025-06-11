import { AssessmentSidebar } from "@/app/(frontend)/components/assessment-sidebar"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
import { auth } from "@/auth"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  fetchAssessment,
  fetchAssessmentUsers,
  fetchAssessmentType,
  fetchPart,
} from "../../../../../utils/dataFetchers"
import {
  canUserParticipateInPart,
  isAdmin,
  isFacForAssessment,
  isLeadForAssessment,
  isManagerForCollection,
  viewableParts,
  viewableResponses,
} from "../../../../../utils/permissions"

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
    }
  }>
) {
  const params = await props.params

  const { children } = props

  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const parts = await viewableParts(
    session,
    params.assessmentGroupId,
    params.assessmentId,
    params.roleName
  )
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)

  const isParticipant = params.roleName === "Participant"
  const userResponses = await viewableResponses(
    session,
    params.assessmentId,
    params.roleName
  )

  if (assessmentType && assessment && parts) {

    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: assessmentType.name,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name,
      },
    ]

    if (part) {
      const currentAssessmentPart = assessment.assessmentParts.find((p) => p.partId === part.id)
      const viewableStatuses = ["Active", "Final"]

      const canViewAsFac =
        isAdmin(session) ||
        isManagerForCollection(session, assessment.assessmentCollectionId) ||
        isLeadForAssessment(session, params.assessmentId) ||
        isFacForAssessment(session, params.assessmentId)
      const canViewAsParticipant = canUserParticipateInPart(
        session,
        params.assessmentId,
        part.id
      )

      const facAuthorized = params.roleName === "Facilitator" && canViewAsFac
      const participantAuthorized =
        params.roleName === "Participant" &&
        canViewAsParticipant

      if (
        facAuthorized || (
          participantAuthorized &&
          currentAssessmentPart &&
          viewableStatuses.includes(currentAssessmentPart.status)
        )
      ) {
        return (
          <SidebarProvider defaultOpen={false}>
            <AssessmentSidebar
              assessment={assessment}
              assessmentType={assessmentType}
              assessmentUsers={assessmentUsers}
              isParticipant={isParticipant}
              role={params.roleName}
              parts={parts}
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
