import { dummyData } from "@/app/utils/dummyData"

import * as assessmentCollection from "@/app/utils/assessmentCollection"

import { Collections } from "./collections"

async function fetchHomePageData() {
  // TODO: Replace with actual data based on user role/permissions
  return dummyData()
}

async function fetchAssessmentCollections() {
  return await assessmentCollection.findMany({})
}

export default async function Page() {

  // const assessmentCollections = await fetchAssessmentCollections()

  const data = await fetchHomePageData()
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Collections data={data}/>
    </div>
  )
}