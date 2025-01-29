import { fetchAssessmentType, fetchAssessment, fetchParts } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin, isManagerForCollection, isLeadForAssessment, getAssessmentUserPermissions } from "../../../utils/permissions"

import AssessmentContent from "./assessment"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const parts = await fetchParts(params.assessmentGroupId)

  const permissions = await getAssessmentUserPermissions(session, params.assessmentId)
  const canEdit = 
    isAdmin(session) || 
    isManagerForCollection(session, assessment?.assessmentCollectionId) || 
    isLeadForAssessment(session, params.assessmentId) ||
    permissions?.find(permission => permission.name === "Edit assessments") !== undefined
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <AssessmentContent assessment={assessment} assessmentType={assessmentType} parts={parts} canEdit={canEdit} />
    </div>
  )
}
