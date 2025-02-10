import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSection, 
  fetchAttributes
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableResponses } from "../../../../../utils/permissions"

import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string 
  } 
}>) {
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attributes = await fetchAttributes(params.sectionId)

  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const userResponses = await viewableResponses(session, params.assessmentId)
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <DataTable 
        assessment={assessment} 
        assessmentType={assessmentType} 
        part={part} section={section} 
        attributes={attributes} 
        userResponses={userResponses}
        isParticipant={isParticipant}
      />
    </div>
  )
}
