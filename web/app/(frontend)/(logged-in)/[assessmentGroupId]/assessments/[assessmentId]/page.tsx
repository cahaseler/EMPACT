import { dummyData } from "@/app/utils/dummyData"
import * as assessment from "@/app/utils/assessment"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import Link from "next/link"

// TODO: Fetch actual data based on user role/permissions
async function fetchPageData() {
  return dummyData()
}

async function fetchAssessment(assessmentId: string) {

  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessment.findUnique({ where: { id: idAsInteger } })
}

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  // const assessment = await fetchAssessment(params.assessmentId)
  const data = await fetchPageData()
  const assessmentCollection = data.assessmentCollections.filter(
    (collection: any) => collection.id === parseInt(params.assessmentGroupId, 10))[0]
  const assessment = assessmentCollection.assessments.filter(
    (assessment: any) => assessment.id === parseInt(params.assessmentId, 10))[0]
  const links = [
    {
      url: `/${params.assessmentGroupId}/assessments`, 
      name: assessmentCollection.name + " Assessments"
    },
  ]
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <h1 className="text-3xl font-bold tracking-tighter">{assessment.name}</h1>
          </div>
        </section>
        <section className="mb-16">
            <div className="w-full flex flex-row space-x-2 sm:space-x-4">
              {assessment.type !== "Environment" && <Link
                  href={`/${params.assessmentGroupId}/assessments/${params.assessmentId}/maturity`}
                  className={"w-1/2 flex h-40 items-center justify-center rounded-md px-8 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    + (assessment.maturityStatus === "Completed" ? " bg-indigo-700/70 hover:bg-indigo-700/90" : " bg-indigo-700/90 hover:bg-indigo-700/70")
                  }
                  prefetch={false}
              >
                  <div className="flex flex-col space-y-2 text-center">
                      <h2 className="text-xl font-bold text-indigo-50">
                        Maturity
                      </h2>
                      <h3 className="text-md text-indigo-50/70">
                        Status: {assessment.maturityStatus}
                      </h3>
                  </div>
              </Link>}
              {assessment.type !== "Maturity" && <Link
                  href={`/${params.assessmentGroupId}/assessments/${params.assessmentId}/environment`}
                  className={"w-1/2 flex h-40 items-center justify-center rounded-md px-8 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    + (assessment.environmentStatus === "Completed" ? " bg-indigo-700/70 hover:bg-indigo-700/90" : " bg-indigo-700/90 hover:bg-indigo-700/70")
                  }
                  prefetch={false}
              >
                  <div className="flex flex-col space-y-2 text-center">
                      <h2 className="text-xl font-bold text-indigo-50">
                        Environment
                      </h2>
                      <h3 className="text-md text-indigo-50/70">
                        Status: {assessment.environmentStatus}
                      </h3>
                  </div>
              </Link>}
            </div>
        </section>
      </div>
    </div>
  )
}
