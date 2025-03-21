import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Assessment,
  AssessmentType,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section,
  User,
} from "@/prisma/mssql/generated/client"
import AttributeResponseTable from "./attributeResponseTable"
import AttributeUserResponse from "./attributeUserResponse"

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
  userResponses,
}: {
  readonly assessment: Assessment
  readonly assessmentType: AssessmentType
  readonly role: string
  readonly part: Part
  readonly section: Section
  readonly attribute: Attribute
  readonly prevAttribute: Attribute | null
  readonly nextAttribute: Attribute | null
  readonly levels: Level[]
  readonly userId: string | undefined
  readonly isParticipant: boolean
  readonly userResponses: (AssessmentUserResponse & { user?: User })[]
}) {
  return (
    <>
      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold max-lg:ml-2">Levels</h2>
        <Accordion
          type="single"
          collapsible={true}
          className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
        >
          {levels.map((level: Level, key: number) => (
            <AccordionItem
              key={key}
              value={level.level.toString()}
              className="last:border-b-0 group"
            >
              <AccordionTrigger className="text-indigo-950 dark:text-indigo-200 md:text-lg text-left font-bold mx-4 hover:no-underline">
                {level.level} - {level.shortDescription}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: level.longDescription }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      {isParticipant ? (
        <AttributeUserResponse
          assessment={assessment}
          userId={userId}
          attributeId={attribute.id}
          levels={levels}
          userResponse={userResponses[0]}
        />
      ) : (
        <AttributeResponseTable userResponses={userResponses} levels={levels} />
      )}
      <section className="mb-8 space-y-4">
        <div
          className={
            "w-full flex flex-row " +
            (prevAttribute ? "justify-between" : "justify-end")
          }
        >
          {prevAttribute && (
            <Link
              href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${prevAttribute.id}`}
            >
              <Button>Previous</Button>
            </Link>
          )}
          {nextAttribute &&
            (isParticipant && userResponses.length === 0 ? (
              <Button disabled={true}>Next</Button>
            ) : (
              <Link
                href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${nextAttribute.id}`}
              >
                <Button>Next</Button>
              </Link>
            ))}
        </div>
      </section>
    </>
  )
}
