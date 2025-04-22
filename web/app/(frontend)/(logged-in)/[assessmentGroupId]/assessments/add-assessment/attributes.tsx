"use client"
import { useState, RefObject } from "react"
import { Part, Section, Attribute } from "@/prisma/mssql/generated/client"

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export default function AssessmentAttributes({
    parts,
    attributesToAdd
}: {
    readonly parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
    readonly attributesToAdd: RefObject<string[]>
}) {
    return (
        <Accordion
            type="single"
            collapsible={true}
            className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
        >
            {parts.map((part: Part & { sections: (Section & { attributes: Attribute[] })[] }) => {
                return (
                    <AccordionItem key={part.id} value={part.name} className="last:border-b-0 group">
                        <AccordionTrigger className="text-indigo-950 dark:text-indigo-200 md:text-lg text-left font-bold mx-4 hover:no-underline">
                            {part.name} {part.attributeType}s
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
                            <Accordion
                                type="single"
                                collapsible={true}
                                className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
                            >
                                {part.sections.map((section: Section & { attributes: Attribute[] }) => {
                                    return (
                                        <AccordionItem key={section.id} value={section.name} className="last:border-b-0 group">
                                            <AccordionTrigger className="text-indigo-900 dark:text-indigo-200 text-left font-medium mx-4 hover:no-underline">
                                                {section.id.toUpperCase()}. {section.name}
                                            </AccordionTrigger>
                                            <AccordionContent className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0">
                                                {section.attributes.map((attribute: Attribute) => {
                                                    const [isChecked, setIsChecked] = useState(true)
                                                    return (
                                                        <div key={attribute.id} className="flex flex-row space-x-4 pb-4 items-center border-b-2 border-indigo-100 dark:border-indigo-900">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        attributesToAdd.current.push(attribute.id)
                                                                        setIsChecked(true)
                                                                    } else {
                                                                        attributesToAdd.current = attributesToAdd.current.filter((id) =>
                                                                            id !== attribute.id
                                                                        )
                                                                        setIsChecked(false)
                                                                    }
                                                                }}
                                                            />
                                                            <div>{attribute.id.toUpperCase()}. {attribute.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}