import { fetchAssessmentType, fetchAssessment, fetchAssessmentUsers } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { getAssessmentUserPermissions } from "../../../utils/permissions"

import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const session = await auth()

  const users = await fetchAssessmentUsers(params.assessmentId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const permissions = await getAssessmentUserPermissions(session, params.assessmentId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <DataTable 
        users={users} 
        assessment={assessment} 
        assessmentType={assessmentType} 
        session={session}
        permissions={permissions}
      />
    </div>
  )
}
