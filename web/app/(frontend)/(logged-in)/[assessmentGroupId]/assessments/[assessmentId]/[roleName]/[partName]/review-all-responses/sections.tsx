"use client"

import {
  AssessmentAttribute,
  AssessmentUserResponse,
  Level,
  Part,
  Section,
  Attribute
} from "@/prisma/mssql/generated/client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import DataTable from "./data-table"

export default function Sections({
  assessmentTypeId,
  assessmentId,
  part,
  assessmentAttributes,
  userResponses
}: {
  readonly assessmentTypeId: number
  readonly assessmentId: number
  readonly part: Part & { sections: (Section & { attributes: (Attribute & { levels: Level[] })[] })[] }
  readonly assessmentAttributes: AssessmentAttribute[]
  readonly userResponses: AssessmentUserResponse[]
}) {
  const assessmentAttributeIds = assessmentAttributes.map(attribute => attribute.attributeId)

  const router = useRouter()

  const handleClick = () => {
    router.push(`/${assessmentTypeId}/assessments/${assessmentId}`)
    toast({
      title: "Responses submitted successfully."
    })
  }

  return (
    <div className="flex flex-col space-y-8">
      <Accordion
        type="single"
        collapsible={true}
        defaultValue={part?.sections[0]?.name}
        className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
      >
        {part.sections.map((section: Section & { attributes: (Attribute & { levels: Level[] })[] }) => {
          const sectionAttributesInAssessment = section.attributes.filter(
            attribute => assessmentAttributeIds.includes(attribute.id)
          )
          if (sectionAttributesInAssessment.length > 0) {
            return (
              <AccordionItem key={section.id} value={section.name} className="last:border-b-0 group">
                <AccordionTrigger className="mx-4 hover:no-underline">
                  <div className="flex flex-col space-y-4">
                    <span className="text-indigo-950 dark:text-indigo-200 text-left text-2xl font-bold">
                      {section.id.toUpperCase()}. {section.name}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0">
                  <DataTable
                    part={part}
                    urlHead={`${assessmentTypeId}/assessments/${assessmentId}/Participant/${part.name}/${section.id}`}
                    attributes={sectionAttributesInAssessment}
                    userResponses={userResponses}
                  />
                </AccordionContent>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
      <div className="flex flex-col items-center">
        <Button onClick={handleClick}>
          Submit Responses
        </Button>
      </div>
    </div>
  )
}