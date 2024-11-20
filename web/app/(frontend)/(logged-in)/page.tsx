import { dummyData } from "@/app/utils/dummyData"

import { Home } from "./home"

async function fetchHomePageData() {
  // TODO: Replace with actual data based on user role/permissions
  return dummyData()
}

export default async function Page() {

  const data = await fetchHomePageData()
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Home data={data}/>
    </div>
  )
}
