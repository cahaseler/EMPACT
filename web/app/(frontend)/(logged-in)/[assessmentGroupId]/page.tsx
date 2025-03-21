import { auth } from "@/auth"
import {
  fetchAssessmentType,
  fetchPartsSectionsAttributes,
  fetchUserResponses,
} from "../utils/dataFetchers"
import { viewableAssessments } from "../utils/permissions"
import Home from "./home"

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
  const parts = await fetchPartsSectionsAttributes(params.assessmentGroupId)
  const userResponses = await fetchUserResponses(session?.user?.id)

  return (
    <Home
      assessmentType={assessmentType}
      assessments={assessments}
      parts={parts}
      userResponses={userResponses}
      session={session}
    />
  )
}
