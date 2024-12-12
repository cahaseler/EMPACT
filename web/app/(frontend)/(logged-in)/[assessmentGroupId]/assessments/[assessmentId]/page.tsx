import { AssessmentType, Assessment, Part } from "@/prisma/mssql/generated/client"
import * as assessment from "@/app/utils/assessment"
import * as assessmentType from "@/app/utils/assessmentType"
import * as part from "@/app/utils/part"

import AssessmentContent from "./assessment"

async function fetchAssessmentType(typeid: string): Promise<AssessmentType | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessmentType.findUnique({ where: { id: idAsInteger } })
}

async function fetchAssessment(assessmentId: string): Promise<Assessment | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessment.findUnique({ where: { id: idAsInteger } })
}

async function fetchParts(typeid: string ): Promise<Part[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await part.findMany({ where: { assessmentTypeId: idAsInteger } })
}

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const parts = await fetchParts(params.assessmentGroupId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <AssessmentContent assessment={assessment} assessmentType={assessmentType} parts={parts} />
    </div>
  )
}
