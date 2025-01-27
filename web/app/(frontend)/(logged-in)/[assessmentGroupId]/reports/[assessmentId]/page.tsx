import { fetchAssessmentType, fetchAssessment } from "../../../utils/dataFetchers"

import AssessmentReport from "./report"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <AssessmentReport assessment={assessment} assessmentType={assessmentType} />
    </div>
  )
}
