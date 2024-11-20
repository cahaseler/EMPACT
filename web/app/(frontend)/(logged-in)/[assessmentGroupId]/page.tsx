import { dummyData } from "@/app/utils/dummyData"
import * as assessment from "@/app/utils/assessment"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { DataTable } from "./data-table"

// TODO: Fetch actual data based on user role/permissions
async function fetchPageData() {
  return dummyData()
}

async function fetchAssessments(assessmentCollectionId: string) {

  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentCollectionId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessment.findMany({ where: { assessmentCollectionId: idAsInteger } })
}

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const links = [{url: `/assessments`, name: "Assessments"}]
  // const assessments = await fetchAssessments(params.assessmentCollectionId)
  const data = await fetchPageData()
  const assessmentCollection = data.assessmentCollections.filter(
    (collection: any) => collection.id === parseInt(params.assessmentGroupId, 10))[0]
  const assessments = assessmentCollection.assessments
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 ml-2">
            <Breadcrumbs links={links} currentPage={assessmentCollection.name} />
            <h1 className="text-3xl font-bold tracking-tighter">{assessmentCollection.name}</h1>
          </div>
        </section>
        <section className="mb-16">
            <div className="space-y-4">
              <DataTable assessments={assessments} assessmentCollectionId={assessmentCollection.id} />
            </div>
        </section>
      </div>
    </div>
  )
}
