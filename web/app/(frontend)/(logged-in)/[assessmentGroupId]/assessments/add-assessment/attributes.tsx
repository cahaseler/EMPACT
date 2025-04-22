"use client"
import { useState } from "react"
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
    attributesToAdd,
    setAttributesToAddAction
}: {
    readonly parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
    readonly attributesToAdd: string[]
    readonly setAttributesToAddAction: React.Dispatch<React.SetStateAction<string[]>> // Use specific type for state setter
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
                                                {section.attributes.map((attribute: Attribute) => (
                                                    <AttributeCheckbox
                                                        key={attribute.id} // Add unique key prop
                                                        attribute={attribute}
                                                        attributesToAdd={attributesToAdd}
                                                        setAttributesToAdd={setAttributesToAddAction}
                                                    />
                                                ))}
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

// Define the new AttributeCheckbox component specific to this add form
const AttributeCheckbox = ({
    attribute,
    attributesToAdd,
    setAttributesToAdd
}: {
    attribute: Attribute
    attributesToAdd: string[]
    setAttributesToAdd: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    // Initialize state based on whether the attribute is already in the list to add
    // Assuming default is checked (true) for the add form unless specified otherwise
    const [isChecked, setIsChecked] = useState(attributesToAdd.includes(attribute.id));

    const handleCheckedChange = (checked: boolean | "indeterminate") => {
        const newCheckedState = typeof checked === 'boolean' ? checked : false;
        setIsChecked(newCheckedState);

        // Update the parent component's state
        setAttributesToAdd(prev => {
            if (newCheckedState) {
                // Add attribute ID if checked, ensuring no duplicates
                return [...new Set([...prev, attribute.id])];
            } else {
                // Remove attribute ID if unchecked
                return prev.filter(id => id !== attribute.id);
            }
        });
    }

    const checkboxId = `add-attr-checkbox-${attribute.id}`;

    return (
        <div className="flex flex-row space-x-4 pb-4 items-center border-b-2 border-indigo-100 dark:border-indigo-900 last:border-b-0 last:pb-0">
            <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                id={checkboxId}
                // Default checked state for the add form might be true, adjust if needed
                defaultChecked={true}
            />
            <label htmlFor={checkboxId} className="cursor-pointer flex-grow">
                {attribute.id.toUpperCase()}. {attribute.name}
            </label>
        </div>
    )
}