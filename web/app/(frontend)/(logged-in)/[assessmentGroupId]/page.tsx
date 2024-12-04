import { dummyData } from "@/app/utils/dummyData"

import { Home } from "./home"

async function fetchHomePageData() {
  // TODO: Replace with actual data based on user role/permissions
  return dummyData()
}

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {

  const data = await fetchHomePageData()
  const assessmentCollection = data.assessmentCollections.filter(
    (collection: any) => collection.id === parseInt(params.assessmentGroupId, 10))[0]
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Home assessmentCollection={assessmentCollection}/>
    </div>
  )
}