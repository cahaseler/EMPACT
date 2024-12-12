import { AssessmentType, AssessmentCollection, Assessment, Part } from "@/prisma/mssql/generated/client"
import * as assessmentType from "@/app/utils/assessmentType"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessment from "@/app/utils/assessment"
import * as part from "@/app/utils/part"

import { Home } from "./home"

async function fetchAssessmentType(typeid: string): Promise<AssessmentType | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessmentType.findUnique({ where: { id: idAsInteger } })
}

async function fetchAssessmentCollections(typeid: string): Promise<AssessmentCollection[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessmentCollection.findMany({ where: { assessmentTypeId: idAsInteger } })
}

// Returns assessments in collections of given type
async function fetchAssessments(typeid: string ): Promise<Assessment[]> {
  const collections = await fetchAssessmentCollections(typeid)
  const collectionIds = collections.map((collection: any) => collection.id)

  return await assessment.findMany({ where: { assessmentCollectionId: { in: collectionIds } } })
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

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await fetchAssessments(params.assessmentGroupId)
  const parts = await fetchParts(params.assessmentGroupId)
  
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Home assessmentType={assessmentType} assessments={assessments} parts={parts} />
    </div>
  )
}