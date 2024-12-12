import { AssessmentType, Assessment, Part, Section, Attribute } from "@/prisma/mssql/generated/client"
import * as assessment from "@/app/utils/assessment"
import * as assessmentType from "@/app/utils/assessmentType"
import * as part from "@/app/utils/part"
import * as section from "@/app/utils/section"
import * as attribute from "@/app/utils/attribute"

import { DataTable } from "./data-table"

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

async function fetchPart(typeid: string, partName: string): Promise<Part | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }
  const parts = await part.findMany({ where: { assessmentTypeId: idAsInteger } })
  const uniquePart = parts.find(part => part.name === partName)
  if (uniquePart === undefined) {
    return null
  }
  return uniquePart
}

async function fetchSection(sectionId: string): Promise<Section | null> {
  return await section.findUnique({ where: { id: sectionId } })
}

async function fetchAttributes(sectionId: string ): Promise<Attribute[]> {
  return await attribute.findMany({ where: { sectionId: sectionId } })
}

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string,
    sectionId: string 
  } }>) {
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attributes = await fetchAttributes(params.sectionId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <DataTable assessment={assessment} assessmentType={assessmentType} part={part} section={section} attributes={attributes} />
    </div>
  )
}
