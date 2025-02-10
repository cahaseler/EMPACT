import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPartsSectionsAttributes, 
  fetchAssessmentParticipants 
} from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
  isAdmin, 
  isManagerForCollection, 
  isLeadForAssessment, 
  isParticipantForAssessment,
  viewableResponses 
} from "../../../utils/permissions"

import AssessmentContent from "./assessment"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const parts = await fetchPartsSectionsAttributes(params.assessmentGroupId)
  const assessmentParticipants = await fetchAssessmentParticipants(params.assessmentId)

  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const numAssessmentUsers = isParticipant ? 1 : assessmentParticipants.length
  const userResponses = await viewableResponses(session, params.assessmentId)

  const permissions = session?.user?.assessmentUser.find(assessmentUser => 
    assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions
  const canEdit = 
    isAdmin(session) || 
    isManagerForCollection(session, assessment?.assessmentCollectionId) || 
    isLeadForAssessment(session, params.assessmentId) ||
    permissions?.find(permission => permission.name === "Edit assessments") !== undefined
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <AssessmentContent 
        assessment={assessment} 
        assessmentType={assessmentType} 
        parts={parts} 
        numAssessmentUsers={numAssessmentUsers}
        userResponses={userResponses} 
        canEdit={canEdit} 
      />
    </div>
  )
}
