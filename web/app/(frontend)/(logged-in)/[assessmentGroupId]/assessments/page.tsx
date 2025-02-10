import { fetchAssessmentType } from "../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableAssessments } from "../../utils/permissions"

import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(session, params.assessmentGroupId)

  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <DataTable 
        assessments={assessments} 
        assessmentType={assessmentType} 
        session={session}
       />
    </div>
  )
}