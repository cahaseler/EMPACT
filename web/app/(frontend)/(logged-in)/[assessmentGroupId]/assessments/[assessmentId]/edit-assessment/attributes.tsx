"use client"
import { useState } from "react"
import {
    AssessmentAttribute,
    Part,
    Section,
    Attribute
} from "@/prisma/mssql/generated/client"
import { createAssessmentAttributes, deleteAssessmentAttributes } from "../../../../utils/dataActions"

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function AssessmentAttributes({
    assessmentId,
    parts,
    assessmentAttributes
}: {
    readonly assessmentId: number
    readonly parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
    readonly assessmentAttributes: AssessmentAttribute[]
}) {
    const attributeIds = assessmentAttributes.map(attribute => attribute.attributeId)
    const [attributesToAdd, setAttributesToAdd] = useState<string[]>([])
    const [attributesToRemove, setAttributesToRemove] = useState<string[]>([])
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    // Handler for when an attribute checkbox changes state
    const handleAttributeCheckedChange = (attributeId: string, checked: boolean) => {
        // Determine if the attribute was originally checked
        const wasOriginallyChecked = attributeIds.includes(attributeId);

        if (checked) {
            // If checked:
            // - Remove from 'attributesToRemove' if it was there
            setAttributesToRemove(prev => prev.filter(id => id !== attributeId));
            // - Add to 'attributesToAdd' only if it wasn't originally checked
            if (!wasOriginallyChecked) {
                setAttributesToAdd(prev => [...new Set([...prev, attributeId])]); // Use Set to prevent duplicates
            }
        } else {
            // If unchecked:
            // - Remove from 'attributesToAdd' if it was there
            setAttributesToAdd(prev => prev.filter(id => id !== attributeId));
            // - Add to 'attributesToRemove' only if it was originally checked
            if (wasOriginallyChecked) {
                setAttributesToRemove(prev => [...new Set([...prev, attributeId])]); // Use Set to prevent duplicates
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const finalAttributesToAdd = attributesToAdd.filter(id => !attributeIds.includes(id));
        const finalAttributesToRemove = attributesToRemove.filter(id => attributeIds.includes(id));

        if (finalAttributesToAdd.length > 0 || finalAttributesToRemove.length > 0) {
            setSaving(true)
            try {
                // Perform add operations
                if (finalAttributesToAdd.length > 0) {
                    const newAttributes = finalAttributesToAdd.map(
                        attributeId => ({ assessmentId, attributeId })
                    )
                    await createAssessmentAttributes(newAttributes)
                }
                // Perform remove operations
                if (finalAttributesToRemove.length > 0) {
                    await deleteAssessmentAttributes(assessmentId, finalAttributesToRemove)
                }

                // Reset local state tracking changes
                setAttributesToAdd([]);
                setAttributesToRemove([]);
                setSaving(false)
                router.refresh() // Refresh data from server
                toast({
                    title: "Assessment attributes updated successfully."
                })
            } catch (error) {
                setSaving(false) // Ensure saving is reset on error
                console.error("Error updating assessment attributes:", error); // Log error for debugging
                toast({
                    variant: "destructive", // Use destructive variant for errors
                    title: "Error updating assessment attributes.",
                    description: error instanceof Error ? error.message : String(error)
                })
            }
        } else {
            toast({
                title: "No changes detected."
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
                <Accordion
                    type="single"
                    collapsible={true}
                    className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
                >
                    {parts.map((part: Part & { sections: (Section & { attributes: Attribute[] })[] }) => {
                        return (
                            <PartAccordionItem
                                part={part}
                                assessmentAttributes={assessmentAttributes}
                                attributeIds={attributeIds}
                                handleAttributeCheckedChange={handleAttributeCheckedChange}
                            />
                        )
                    })}
                </Accordion>
                <div className="flex flex-col items-center">
                    <Button type="submit" disabled={saving || (attributesToAdd.length === 0 && attributesToRemove.length === 0)}>
                        {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save Changes to Selections
                    </Button>
                </div>
            </div>
        </form>
    )
}

const PartAccordionItem = ({
    part,
    assessmentAttributes,
    attributeIds,
    handleAttributeCheckedChange
}: {
    part: Part & { sections: (Section & { attributes: Attribute[] })[] },
    assessmentAttributes: AssessmentAttribute[],
    attributeIds: string[],
    handleAttributeCheckedChange: (attributeId: string, checked: boolean) => void
}) => {
    const partAttributeIds = part.sections.flatMap(
        section => section.attributes.map(
            attribute => attribute.id
        )
    )
    const [numPartAttributesSelected, setNumPartAttributesSelected] = useState<number>(
        assessmentAttributes.filter(aa =>
            partAttributeIds.includes(aa.attributeId)
        ).length
    )
    return (
        <AccordionItem key={part.id} value={part.name} className="last:border-b-0 group">
            <AccordionTrigger className="mx-4 hover:no-underline">
                <div className="flex flex-col space-y-4">
                    <span className="text-indigo-950 dark:text-indigo-200 md:text-lg text-left font-bold">
                        {part.name} {part.attributeType}s
                    </span>
                    <span className="text-sm text-indigo-950/70 dark:text-indigo-200/70">
                        Number of {part.attributeType}s Selected: {numPartAttributesSelected} of {partAttributeIds.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
                <Accordion
                    type="single"
                    collapsible={true}
                    className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
                >
                    {part.sections.map((section: Section & { attributes: Attribute[] }) => {
                        return (
                            <SectionAccordionItem
                                attributeType={part.attributeType}
                                section={section}
                                assessmentAttributes={assessmentAttributes}
                                attributeIds={attributeIds}
                                handleAttributeCheckedChange={handleAttributeCheckedChange}
                                setNumPartAttributesSelected={setNumPartAttributesSelected}
                            />
                        )
                    })}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    )
}

const SectionAccordionItem = ({
    attributeType,
    section,
    assessmentAttributes,
    attributeIds,
    handleAttributeCheckedChange,
    setNumPartAttributesSelected
}: {
    attributeType: string,
    section: Section & { attributes: Attribute[] },
    assessmentAttributes: AssessmentAttribute[],
    attributeIds: string[],
    handleAttributeCheckedChange: (attributeId: string, checked: boolean) => void,
    setNumPartAttributesSelected: React.Dispatch<React.SetStateAction<number>>
}) => {
    const sectionAttributeIds = section.attributes.map(
        attribute => attribute.id
    )
    const [numSectionAttributesSelected, setNumSectionAttributesSelected] = useState<number>(
        assessmentAttributes.filter(aa =>
            sectionAttributeIds.includes(aa.attributeId)
        ).length
    )
    return (
        <AccordionItem key={section.id} value={section.name} className="last:border-b-0 group">
            <AccordionTrigger className="mx-4 hover:no-underline">
                <div className="flex flex-col space-y-4">
                    <span className="text-indigo-900 dark:text-indigo-200 text-left font-bold">
                        {section.id.toUpperCase()}. {section.name}
                    </span>
                    <span className="text-sm text-indigo-900/70 dark:text-indigo-200/70">
                        Number of {attributeType}s Selected: {numSectionAttributesSelected} of {sectionAttributeIds.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0">
                {section.attributes.map((attribute: Attribute) => (
                    <AttributeCheckbox
                        key={attribute.id} // Add unique key prop
                        attribute={attribute}
                        initialChecked={attributeIds.includes(attribute.id)}
                        onCheckedChange={handleAttributeCheckedChange}
                        setNumPartAttributesSelected={setNumPartAttributesSelected}
                        setNumSectionAttributesSelected={setNumSectionAttributesSelected}
                    />
                ))}
            </AccordionContent>
        </AccordionItem>
    )
}


// Define the new AttributeCheckbox component
const AttributeCheckbox = ({
    attribute,
    initialChecked,
    onCheckedChange,
    setNumPartAttributesSelected,
    setNumSectionAttributesSelected
}: {
    attribute: Attribute
    initialChecked: boolean
    onCheckedChange: (attributeId: string, checked: boolean) => void
    setNumPartAttributesSelected: React.Dispatch<React.SetStateAction<number>>
    setNumSectionAttributesSelected: React.Dispatch<React.SetStateAction<number>>
}) => {
    // State is now managed within this component
    const [isChecked, setIsChecked] = useState(initialChecked)

    const handleCheckedChange = (checked: boolean | "indeterminate") => {
        // Ensure checked is boolean, handle indeterminate if necessary
        const newCheckedState = typeof checked === 'boolean' ? checked : false;
        setIsChecked(newCheckedState);
        if (newCheckedState) {
            setNumPartAttributesSelected(prev => prev + 1)
            setNumSectionAttributesSelected(prev => prev + 1)
        } else {
            setNumPartAttributesSelected(prev => prev - 1)
            setNumSectionAttributesSelected(prev => prev - 1)
        }
        // Notify parent component of the change
        onCheckedChange(attribute.id, newCheckedState);
    }

    // Generate a unique ID for the checkbox for label association
    const checkboxId = `attr-checkbox-${attribute.id}`;

    return (
        // Apply styling to the container div, ensuring it doesn't add extra borders if it's the last item
        <div className="flex flex-row space-x-4 pb-4 items-center border-b-2 border-indigo-100 dark:border-indigo-900 last:border-b-0 last:pb-0">
            <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
                id={checkboxId} // Associate checkbox with label
            />
            {/* Use a label for better accessibility, associate it with the checkbox using htmlFor */}
            <label htmlFor={checkboxId} className="cursor-pointer flex-grow"> {/* flex-grow allows label to take available space */}
                {attribute.id.toUpperCase()}. {attribute.name}
            </label>
        </div>
    )
}