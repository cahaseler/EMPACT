import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart,
  fetchAssessmentParticipants
} from "../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableResponses } from "../../../../utils/permissions"

import PartContent from "./part"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string 
  } }>) {
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const assessmentParticipants = await fetchAssessmentParticipants(params.assessmentId)

  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const numAssessmentUsers = isParticipant ? 1 : assessmentParticipants.length
  const userResponses = await viewableResponses(session, params.assessmentId)
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <PartContent 
        assessment={assessment} 
        assessmentType={assessmentType} 
        part={part} 
        numAssessmentUsers={numAssessmentUsers}
        userResponses={userResponses} 
      />
    </div>
  )
}
