import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSection, 
  fetchAttribute,
  fetchLevels
} from "../../../../../../utils/dataFetchers"

import AttributeContent from "./attributeContent"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string,
    attributeId: string 
  } }>) {
  
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attribute = await fetchAttribute(params.attributeId)
  const levels = await fetchLevels(params.attributeId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <AttributeContent assessment={assessment} assessmentType={assessmentType} part={part} section={section} attribute={attribute} levels={levels} />
    </div>
  )
}
