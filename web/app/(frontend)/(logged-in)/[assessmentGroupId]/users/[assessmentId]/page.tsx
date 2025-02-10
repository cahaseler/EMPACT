import { fetchAssessmentType, fetchAssessment, fetchAssessmentUsers } from "../../../utils/dataFetchers"
import { auth } from "@/auth"

import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const session = await auth()

  const users = await fetchAssessmentUsers(params.assessmentId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const permissions = session?.user?.assessmentUser.find(assessmentUser => 
    assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions
  
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
