import { fetchAssessmentType, fetchAssessment, fetchParts } from "../../../utils/dataFetchers"

import AssessmentContent from "./assessment"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const parts = await fetchParts(params.assessmentGroupId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <AssessmentContent assessment={assessment} assessmentType={assessmentType} parts={parts} />
    </div>
  )
}
