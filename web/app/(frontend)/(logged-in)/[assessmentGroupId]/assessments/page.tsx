import { fetchAssessmentType, fetchAssessments } from "../utils/dataFetchers"

import { DataTable } from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await fetchAssessments(params.assessmentGroupId)

  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <DataTable assessments={assessments} assessmentType={assessmentType} />
    </div>
  )
}