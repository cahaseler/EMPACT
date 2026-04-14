import { AssessmentSidebar } from "@/app/(frontend)/components/assessment-sidebar/assessment-sidebar"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotAuthorized from "@/app/(frontend)/components/notAuthorized"
import NotFound from "@/app/(frontend)/components/notFound"
import { auth } from "@/auth"
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

  console.log(typeof window !== "undefined" && localStorage.getItem("sidebarPinnedOpen"))

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
          <AssessmentSidebar
            assessment={assessment}
            assessmentType={assessmentType}
            assessmentUsers={assessmentUsers}
            isParticipant={isParticipant}
            role={params.roleName}
            parts={parts}
            userResponses={userResponses}
          >
            {children}
          </AssessmentSidebar>
        )
      }
      return <NotAuthorized links={links} pageType={part.name} />
    }
    return <NotFound links={links} pageType="part" />
  }
}
