"use client"
import { useState } from "react"
import { AssessmentAttribute, Part, Section, Attribute } from "@/prisma/mssql/generated/client"
import { createAssessmentAttribute, deleteAssessmentAttribute } from "../../../../utils/dataActions"

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (attributesToAdd.length > 0 || attributesToRemove.length > 0) {
            setSaving(true)
            try {
                if (attributesToAdd.length > 0) {
                    for (var i = 0; i < attributesToAdd.length; i++) {
                        await createAssessmentAttribute(assessmentId, attributesToAdd[i])
                    }
                }
                if (attributesToRemove.length > 0) {
                    for (var i = 0; i < attributesToRemove.length; i++) {
                        await deleteAssessmentAttribute(assessmentId, attributesToRemove[i])
                    }
                }
                setSaving(false)
                router.refresh()
                toast({
                    title: "Assessment updated successfully."
                })
            } catch (error) {
                toast({
                    title: `Error updating assessment: ${error}`
                })
            }
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
                                                            const [isChecked, setIsChecked] = useState(attributeIds.includes(attribute.id))
                                                            return (
                                                                <div className="flex flex-row space-x-4 pb-4 items-center border-b-2 border-indigo-100 dark:border-indigo-900">
                                                                    <Checkbox 
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                setAttributesToAdd([...attributesToAdd, attribute.id])
                                                                                if (attributesToRemove.length > 0) {
                                                                                    setAttributesToRemove(attributesToRemove.filter((id) => 
                                                                                        id !== attribute.id
                                                                                    ))
                                                                                }
                                                                                setIsChecked(true)
                                                                            } else {
                                                                                setAttributesToRemove([...attributesToRemove, attribute.id])
                                                                                if (attributesToAdd.length > 0) {
                                                                                    setAttributesToAdd(attributesToAdd.filter((id) => 
                                                                                        id !== attribute.id
                                                                                    ))
                                                                                }
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
                <div className="flex flex-col items-center">
                    <Button type="submit" disabled={saving || (attributesToAdd.length === 0 && attributesToRemove.length === 0)}>
                        {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Save Changes
                    </Button>
                </div>
            </div>
        </form>
    )
}