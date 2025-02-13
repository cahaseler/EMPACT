import { 
  User,
  AssessmentType, 
  Assessment, 
  Part, 
  Section, 
  Attribute, 
  Level, 
  AssessmentUserResponse 
} from "@/prisma/mssql/generated/client"

import { Card } from "@/components/ui/card"
import {
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import Link from "next/link"

import AttributeUserResponse from "./attributeUserResponse"
import AttributeResponseTable from "./attributeResponseTable"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"

export default function AttributeContent({
  assessment, 
  assessmentType,
  part,
  section,
  attribute,
  prevAttribute,
  nextAttribute,
  levels,
  userId,
  isParticipant,
  userResponses
}: {
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  part: Part | null,
  section: Section | null,
  attribute: Attribute | null,
  prevAttribute: Attribute | null,
  nextAttribute: Attribute | null,
  levels: Level[],
  userId: string | undefined,
  isParticipant: boolean,
  userResponses: (AssessmentUserResponse & { user?: User })[]
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
                    <Breadcrumbs links={links} currentPage={part.attributeType + " " + attribute.id.toString().toUpperCase()} />
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
                {isParticipant ? 
                  <AttributeUserResponse 
                    assessment={assessment} 
                    userId={userId}
                    attributeId={attribute.id} 
                    levels={levels} 
                    userResponse={userResponses[0]} 
                  /> :
                  <AttributeResponseTable userResponses={userResponses} levels={levels} />
                }
                <section className="mb-8 space-y-4">
                  <div className={"w-full flex flex-row " + (prevAttribute ? "justify-between" : "justify-end")}>
                    {prevAttribute && 
                      <Link href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}/${prevAttribute.id}`}>
                        <Button>Previous</Button>
                      </Link>
                    }
                    {nextAttribute && (
                      isParticipant && userResponses.length === 0 ?
                        <Button disabled={true}>
                          Next
                        </Button> 
                      :
                        <Link href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}/${nextAttribute.id}`}>
                          <Button>
                            Next
                          </Button>
                        </Link>
                      )
                    }
                    </div>
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