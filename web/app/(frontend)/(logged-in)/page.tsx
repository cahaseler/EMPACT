import { Home } from "./home"


async function fetchHomePageData() {
  // write code here that fetches whatever data it is we need for the homepage. 
  // A list of assessment collections that the current user can see would likely be a good start
}

export default async function Page() {

  const data = await fetchHomePageData()
  return (
    <div className="flex h-full flex-col items-center justify-start p-10">
      <Home data={data}/>
    </div>
  )
}
