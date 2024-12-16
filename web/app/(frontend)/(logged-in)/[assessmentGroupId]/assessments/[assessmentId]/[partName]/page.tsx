import { 
  fetchAssessmentType, 
  fetchAssessment, 
  fetchPart, 
  fetchSections
} from "../../../utils/dataFetchers"

import PartContent from "./part"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string 
  } }>) {
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const sections = await fetchSections(params.assessmentGroupId, params.partName)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <PartContent assessment={assessment} assessmentType={assessmentType} part={part} sections={sections} />
    </div>
  )
}
