import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSection, 
  fetchAttribute,
  fetchPreviousAttribute,
  fetchNextAttribute,
  fetchLevels
} from "../../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableAttributeResponses } from "../../../../../../utils/permissions"

import AttributeContent from "./attributeContent"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string,
    attributeId: string 
  } 
}>) {
  const session = await auth()
  
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attribute = await fetchAttribute(params.attributeId)
  const prevAttribute = await fetchPreviousAttribute(params.assessmentGroupId, params.attributeId)
  const nextAttribute = await fetchNextAttribute(params.assessmentGroupId, params.attributeId)
  const levels = await fetchLevels(params.attributeId)
  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const userResponses = await viewableAttributeResponses(session, params.assessmentId, params.attributeId)
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <AttributeContent 
        assessment={assessment} 
        assessmentType={assessmentType} 
        part={part} 
        section={section} 
        attribute={attribute}
        prevAttribute={prevAttribute}
        nextAttribute={nextAttribute} 
        levels={levels} 
        userId={session?.user?.id}
        isParticipant={isParticipant}
        userResponses={userResponses}
      />
    </div>
  )
}
