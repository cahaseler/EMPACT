import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotAuthorized from "@/app/(frontend)/components/notAuthorized"
import { auth } from "@/auth"
import {
  fetchAllResponsesForAssessment,
  fetchAssessment,
  fetchAssessmentType,
  fetchAssessmentUserGroups,
  fetchAssessmentUsers,
  fetchScoreSummaries
} from "../../../../utils/dataFetchers"
import {
  isAdmin,
  isManagerForCollection,
  isLeadForAssessment
} from "../../../../utils/permissions"

import PageView from "./page-view"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const responses = await fetchAllResponsesForAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
  const scores = await fetchScoreSummaries(params.assessmentId)

  if (assessmentType && assessment) {

    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name,
      },
    ]

    const canExport =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId)

    if (canExport) {
      return (
        <PageView
          assessmentType={assessmentType}
          assessment={assessment}
          responses={responses}
          groups={groups}
          assessmentUsers={assessmentUsers}
          scores={scores}
        />
      )
    }
    return <NotAuthorized links={links} pageType={assessment.name} />
  }
}