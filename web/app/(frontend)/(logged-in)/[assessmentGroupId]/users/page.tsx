import { fetchAssessmentType } from "../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableAssessments } from "../../utils/permissions"

import { DataTable } from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(session, params.assessmentGroupId)

  if (assessmentType) {
    return (
      <DataTable assessments={assessments} assessmentType={assessmentType} />
    )
  }
}