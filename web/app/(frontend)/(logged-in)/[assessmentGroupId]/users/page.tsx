import { auth } from "@/auth"
import {
  fetchAssessmentCollections,
  fetchAssessmentType,
} from "../../utils/dataFetchers"
import { isAdmin, viewableAssessments } from "../../utils/permissions"
import PageView from "./page-view"

export default async function Page(
  props: Readonly<{ params: { assessmentGroupId: string } }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(
    session,
    params.assessmentGroupId
  )
  const collections = await fetchAssessmentCollections(params.assessmentGroupId)

  if (assessmentType) {
    const nonFinalOrArchivedAssessments = assessments.filter(
      assessment => assessment.status !== "Final" && assessment.status !== "Archived"
    )
    return (
      <PageView
        assessments={nonFinalOrArchivedAssessments}
        collections={collections}
        assessmentType={assessmentType}
        isAdmin={isAdmin(session)}
      />
    )
  }
}
