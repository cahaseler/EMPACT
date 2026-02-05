import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
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
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <p className="text-md text-muted-foreground dark:text-indigo-300/80">
              You are not authorized to view this page.
            </p>
          </div>
        </section>
      </div>
    )
  }
}