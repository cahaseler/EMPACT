import { dummyData } from "@/app/utils/dummyData"
import * as part from "@/app/utils/part"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import Link from "next/link"

// TODO: Fetch actual data based on user role/permissions
async function fetchPageData() {
  return dummyData()
}

async function fetchPart(partId: string) {

  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(partId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await part.findUnique({ where: { id: idAsInteger } })
}

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string, 
    assessmentId: string, 
    partName: string 
  } }>) {
  // const part = await fetchPart(params.assessmentCollectionId)
  const data = await fetchPageData()
  const assessmentCollection = data.assessmentCollections.filter(
    (collection: any) => collection.id === parseInt(params.assessmentGroupId, 10))[0]
  const assessment = assessmentCollection.assessments.filter(
    (assessment: any) => assessment.id === parseInt(params.assessmentId, 10))[0]
  const sections = params.partName === "maturity" ? assessment.subprocesses : assessment.categories
  const links = [
    {
      url: `/${params.assessmentGroupId}/assessments`, 
      name: assessmentCollection.name + " Assessments"
    },
    {
      url: `/${params.assessmentGroupId}/${params.assessmentId}`
      , name: assessment.name
    }
  ]
  const pageTitle = params.partName.charAt(0).toUpperCase() + params.partName.slice(1)
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 ml-2">
            <Breadcrumbs links={links} currentPage={pageTitle} />
            <h1 className="text-3xl font-bold tracking-tighter">{pageTitle} Assessment</h1>
          </div>
        </section>
        <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {sections.map((section) => {
                return(
                  <Link
                    href={`/${params.assessmentGroupId}/assessments/${params.assessmentId}/${params.partName}/${section.id}`}
                    className={"flex min-h-40 items-center justify-center rounded-md px-8 py-3 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      + (section.status === "Completed" ? " bg-indigo-700/70 hover:bg-indigo-700/90" : " bg-indigo-700/90 hover:bg-indigo-700/70")
                    }
                    prefetch={false}
                  >
                    <div className="flex flex-col space-y-2 text-center">
                      <h2 className="text-xl font-bold text-indigo-50">
                        {section.name}
                      </h2>
                      <h3 className="text-md text-indigo-50/70">
                        Status: {section.status}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
        </section>
        {/* TODO: Submit assessment functionality */}
        <section className="mb-16">
          <div className="flex justify-center items-center">
            <button className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:bg-indigo-700/70" disabled={assessment.status === "Completed"}>
              Submit Assessment
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
