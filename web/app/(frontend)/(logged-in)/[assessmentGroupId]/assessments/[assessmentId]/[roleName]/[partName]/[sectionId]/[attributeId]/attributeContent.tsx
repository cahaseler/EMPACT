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

export default function AttributeContent({
  assessment, 
  assessmentType,
  role,
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
  assessment: Assessment, 
  assessmentType: AssessmentType,
  role: string,
  part: Part,
  section: Section,
  attribute: Attribute,
  prevAttribute: Attribute | null,
  nextAttribute: Attribute | null,
  levels: Level[],
  userId: string | undefined,
  isParticipant: boolean,
  userResponses: (AssessmentUserResponse & { user?: User })[]
}) {
  return (
    <>
      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold max-lg:ml-2">Levels</h2>
        <Accordion type="single" collapsible={true} className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900">
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
      {isParticipant && 
        <AttributeUserResponse 
          assessment={assessment} 
          userId={userId}
          attributeId={attribute.id} 
          levels={levels} 
          userResponse={userResponses[0]} 
        /> 
      }
      <section className="mb-8 space-y-4">
        <div className={"w-full flex flex-row " + (prevAttribute ? "justify-between" : "justify-end")}>
          {prevAttribute && 
            <Link href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${prevAttribute.id}`}>
              <Button>Previous</Button>
            </Link>
          }
          {nextAttribute && (
            isParticipant && userResponses.length === 0 ?
              <Button disabled={true}>
                Next
              </Button> 
            :
              <Link href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${nextAttribute.id}`}>
                <Button>
                  Next
                </Button>
              </Link>
            )
          }
          </div>
      </section>
    </>
  )
}