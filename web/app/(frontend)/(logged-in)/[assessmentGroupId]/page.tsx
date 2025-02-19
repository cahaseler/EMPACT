import { fetchAssessmentType, fetchPartsSectionsAttributes, fetchUserResponses } from "../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableAssessments } from "../utils/permissions"

import Home from "./home"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(session, params.assessmentGroupId)
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