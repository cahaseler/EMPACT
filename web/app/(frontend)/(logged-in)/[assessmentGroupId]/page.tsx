import { fetchAssessmentType, fetchAssessments, fetchParts } from "../utils/dataFetchers"

import { Home } from "./home"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await fetchAssessments(params.assessmentGroupId)
  const parts = await fetchParts(params.assessmentGroupId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Home assessmentType={assessmentType} assessments={assessments} parts={parts} />
    </div>
  )
}