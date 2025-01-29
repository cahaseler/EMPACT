import { AssessmentType, Assessment, Part, Section, Attribute, Level } from "@/prisma/mssql/generated/client"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
import { Card } from "@/components/ui/card"
import {
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent
} from "@/components/ui/accordion"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function AttributeContent({
  assessment, 
  assessmentType,
  part,
  section,
  attribute,
  levels
}: {
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  part: Part | null,
  section: Section | null,
  attribute: Attribute | null,
  levels: Level[]
}) {
  if(assessmentType) {
    const links = [
      {
      url: `/${assessmentType.id}/assessments`,
      name: assessmentType.name
      }
    ]
    if(assessment) {
      links.push({
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name
      });
      if (part) {
        links.push({
        url: `/${assessmentType.id}/assessments/${assessment.id}/${part.name}`,
        name: part.name
        });
        if (section) {
          links.push({
            url: `/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}`,
            name: `${section.id.toString().toUpperCase()}. ${section.name}`
          });
          if (attribute) {
            return (
              <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                  <div className="space-y-4 max-lg:ml-2">
                    <Breadcrumbs links={links} currentPage={"Attribute " + attribute.id.toString().toUpperCase()} />
                    <h1 
                      className="text-3xl font-bold tracking-tighter" 
                      dangerouslySetInnerHTML={{ __html: attribute.id.toString().toUpperCase() + ". " + attribute.name }} 
                    />
                    <Card className="bg-white max-h-60 overflow-auto px-6 py-1">
                      <div 
                        className="text-sm text-description text-muted-foreground dark:text-indigo-300/80" 
                        dangerouslySetInnerHTML={{ __html: attribute.description }} 
                      />
                    </Card>
                  </div>
                </section>
                <section className="mb-8 space-y-4">
                <h2 className="text-2xl font-bold max-lg:ml-2">Levels</h2>
                  <Accordion type="single" collapsible={true} className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    {levels.map((level: Level, key: number) => (
                      <AccordionItem key={key} value={level.level.toString()} className="last:border-b-0 group">
                        <AccordionTrigger className="text-indigo-950 dark:text-indigo-200 md:text-lg text-left font-bold mx-4 hover:no-underline">
                          {level.level} - {level.shortDescription}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
                          <div dangerouslySetInnerHTML={{ __html: level.longDescription }}/>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
                {/* TODO: Connect to a form */}
                {/* TODO: Get attribute rating from AssessmentUserResponse */}
                <section className="mb-8 flex flex-col space-y-4 justify-center">
                  <h2 className="text-2xl font-bold max-lg:ml-2">Rating</h2>
                  <div className="w-1/3 sm:w-1/4 lg:w-1/6">
                    <Select>
                      <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                        <SelectValue placeholder={"Select Rating"} defaultValue={"N/A"}/>
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level: Level) => (
                          <SelectItem value={level.level.toString()} key={level.level}>
                            {level.level.toString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </section>
                <section className="mb-8 flex flex-col space-y-4 justify-center">
                  <h2 className="text-2xl font-bold max-lg:ml-2">Comments</h2>
                  {/* TODO: Convert to WYSIWYG */}
                  {/* TODO: Get attribute comments from AssessmentUserResponse */}
                  <textarea 
                    className="w-full h-40 border border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40 resize-none" 
                    placeholder="Notes for rating (optional for rating 4 and 5)"
                  >
                  </textarea>
                </section>
                <section className="mb-16 flex justify-center">
                  <button className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                    Save Response
                  </button>
                </section>
              </div>
            )
          }
          return <NotFound links={links} pageType="attribute" />
        }
        return <NotFound links={links} pageType="section" />
      }
      return <NotFound links={links} pageType="part" />
    }
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}