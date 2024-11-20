import { dummyData } from "@/app/utils/dummyData"
import * as part from "@/app/utils/part"
import { assessmentDescriptions } from "@/app/utils/assessmentDescriptions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { Card } from "@/components/ui/card"
import {
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent
} from "@/components/ui/accordion"
import { MaturityLevels } from "./maturity-levels"
import { CategoryRatings } from "./category-ratings"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

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
    sectionId: string,
    attributeId: string 
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
  const attribute = section.attributes.filter((attribute: any) => attribute.id === parseInt(params.attributeId, 10))[0]
  const attributeDescription = sectionDescription.attributes.filter((description: any) => description.name === attribute.name)[0]
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
    },
    {
      url: `/${params.assessmentGroupId}/${params.assessmentId}/${params.partName}/${section.id}`
      , name: section.name
    }
  ]
  const attrType = params.partName === "maturity" ? "Attribute" : "Factor"
  
  return (
    <div className="flex h-full flex-col items-center justify-start pt-3 pb-10 ml-2">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4">
            <Breadcrumbs links={links} currentPage={attrType + " " + attribute.name.split(" ")[0]} />
            <h1 
              className="text-3xl font-bold tracking-tighter" 
              dangerouslySetInnerHTML={{ __html: attributeDescription.name }} 
            />
            <Card className="h-60 overflow-auto px-6 py-1">
              <div 
                className="text-sm text-description" 
                dangerouslySetInnerHTML={{ __html: attributeDescription.description }} 
              />
            </Card>
          </div>
        </section>
        <section className="mb-8">
          <Accordion type="multiple" className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border border-indigo-100 dark:border-indigo-900">
            <AccordionItem value="item" className="border-0">
              <AccordionTrigger className="text-2xl font-bold mb-2 mx-4 hover:no-underline">
                {params.partName === "maturity" ? "Maturity Levels" : "Category Ratings"}
              </AccordionTrigger>
              <AccordionContent>
                {params.partName === "maturity" ? 
                  <MaturityLevels maturityLevels={attributeDescription.maturityLevels} /> :
                  <CategoryRatings categoryRatings={assessmentDescriptions().categoryRatings} />
                }
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        {/* TODO: Connect to a form */}
        <section className="mb-8 flex flex-col space-y-2 justify-center">
          <h2 className="text-2xl font-bold mb-2">Rating</h2>
          <div className="w-1/6">
            <Select>
              <SelectTrigger className="h-fit min-h-[32px]">
                <SelectValue placeholder={attribute.rating || "Select Rating"} defaultValue={attribute.rating || "N/A"}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"N/A"} key={"N/A"}>
                  N/A
                </SelectItem>
                <SelectItem value={"1"} key={1}>
                  1
                </SelectItem>
                <SelectItem value={"2"} key={2}>
                  2
                </SelectItem>
                <SelectItem value={"3"} key={3}>
                  3
                </SelectItem>
                <SelectItem value={"4"} key={4}>
                  4
                </SelectItem>
                <SelectItem value={"5"} key={5}>
                  5
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <section className="mb-8 flex flex-col space-y-2 justify-center">
          <h2 className="text-2xl font-bold">Comments</h2>
          {/* TODO: Convert to WYSIWYG */}
          <textarea 
            className="w-full h-40 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4 placeholder:text-indigo-900/40 resize-none" 
            placeholder="Notes for rating (optional for rating 4 and 5)"
          >
            {attribute.comments}
          </textarea>
        </section>
        <section className="mb-16">
          <button className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
            Save
          </button>
        </section>
      </div>
    </div>
  )
}
