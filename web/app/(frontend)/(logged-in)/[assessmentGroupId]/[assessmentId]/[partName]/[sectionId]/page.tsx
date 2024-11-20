import { dummyData } from "@/app/utils/dummyData"
import * as part from "@/app/utils/part"
import { assessmentDescriptions } from "@/app/utils/assessmentDescriptions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import Link from "next/link"
import { DataTable } from "./data-table"

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
    partName: string,
    sectionId: string 
  } }>) {
  // const part = await fetchPart(params.partId)
  const data = await fetchPageData()
  const assessmentCollection = data.assessmentCollections.filter(
    (collection: any) => collection.id === parseInt(params.assessmentGroupId, 10))[0]
  const assessment = assessmentCollection.assessments.filter(
    (assessment: any) => assessment.id === parseInt(params.assessmentId, 10))[0]
  const sections = params.partName === "maturity" ? assessment.subprocesses : assessment.categories
  const sectionDescriptions = params.partName === "maturity" ? assessmentDescriptions().subprocesses : assessmentDescriptions().categories
  const section = sections.filter((section: any) => section.id === parseInt(params.sectionId, 10))[0]
  const sectionDescription = sectionDescriptions.filter((description: any) => description.name === section.name)[0]
  const links = [
    {
      url: `/assessments`, 
      name: "Assessments"
    }, 
    {
      url: `/${params.assessmentGroupId}`
      , name: assessmentCollection.name
    },
    {
      url: `/${params.assessmentGroupId}/${params.assessmentId}`
      , name: assessment.name
    },
    {
      url: `/${params.assessmentGroupId}/${params.assessmentId}/${params.partName}`
      , name: params.partName.charAt(0).toUpperCase() + params.partName.slice(1)
    }
  ]
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 ml-2">
            <Breadcrumbs links={links} currentPage={section.name} />
            <h1 className="text-3xl font-bold tracking-tighter">{section.name}</h1>
            <p className="text-md">{sectionDescription.description}</p>
          </div>
        </section>
        <section className="mb-16">
            <DataTable attributes={section.attributes} url={`/${params.assessmentGroupId}/${params.assessmentId}/${params.partName}/${section.id}`} />
        </section>
      </div>
    </div>
  )
}
