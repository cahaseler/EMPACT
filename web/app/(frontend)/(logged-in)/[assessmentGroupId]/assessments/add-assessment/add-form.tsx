"use client"

import { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "@/components/ui/use-toast"

import {
  Assessment,
  AssessmentCollection,
  AssessmentType,
  Attribute,
  Part,
  Section
} from "@/prisma/mssql/generated/client"
import {
  createAssessment,
  createAssessmentAttribute,
  createAssessmentAttributes,
  createAssessmentPart
} from "../../../utils/dataActions"

import PartsTable from "./parts-table"
import AssessmentAttributes from "./attributes"
import { error } from "console" // Note: 'error' import is unused, consider removing if not needed

// Import the shared type definition
import type { AssessmentPartToAdd } from "@/types/assessment"

export default function AddForm({
  assessmentType,
  assessmentCollections,
  parts
}: Readonly<{
  assessmentType: AssessmentType,
  assessmentCollections: AssessmentCollection[],
  parts: (
    Part & {
      sections: (Section & {
        attributes: Attribute[]
      })[]
    }
  )[]
}>) {
  const [collectionId, setCollectionId] = useState<string | undefined>("")
  const [projectId, setProjectId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [status, setStatus] = useState<string>("Planned")
  const [location, setLocation] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [partsToAdd, setPartsToAdd] = useState<AssessmentPartToAdd[]>([]) // Uses imported type
  const allAttributeIds = parts.flatMap(
    part => part.sections.flatMap(
      section => section.attributes.map(
        attribute => attribute.id
      )
    )
  )
  const [attributesToAdd, setAttributesToAdd] = useState<string[]>(allAttributeIds)
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId !== "" && collectionId !== undefined && name !== "") {
      setSaving(true)
      createAssessment(
        projectId,
        parseInt(collectionId, 10),
        name,
        status,
        location,
        description
      ).then(
        async (assessment: Assessment) => {
          try { // Add try...catch block for better error handling within the promise chain
            for (var i = 0; i < partsToAdd.length; i++) {
              const partData = partsToAdd[i];
              // Ensure partData and its required properties are defined
              if (partData && partData.status && partData.date && partData.partId) {
                await createAssessmentPart(
                  partData.status,
                  partData.date,
                  assessment.id,
                  partData.partId
                )
              } else {
                 console.warn("Skipping part due to missing data:", partData); // Log skipped parts
              }
            }
            if (attributesToAdd.length === 1) {
              const attributeId = attributesToAdd[0];
              // Add explicit check to satisfy TypeScript, although length check implies it's defined
              if (attributeId !== undefined) {
                await createAssessmentAttribute(assessment.id, attributeId)
              }
            } else if (attributesToAdd.length > 1) { // Use else if for clarity
              const newAttributes = attributesToAdd.map(
                attributeId => ({ assessmentId: assessment.id, attributeId })
              );
              // Ensure attributeId is defined before passing to bulk create
              const validAttributes = newAttributes.filter(attr => attr.attributeId !== undefined) as { assessmentId: number, attributeId: string }[];
              if (validAttributes.length > 0) {
                 await createAssessmentAttributes(validAttributes);
              }
            }
            setSaving(false) // Move saving reset here for success case
            router.refresh()
            toast({
              title: "Assessment created successfully."
            })
          } catch (innerError) {
             console.error("Error processing assessment parts/attributes:", innerError);
             setSaving(false); // Ensure saving is reset on inner error
             toast({
               variant: "destructive",
               title: "Error saving assessment details.",
               description: innerError instanceof Error ? innerError.message : String(innerError),
             });
          }
        }
      ).catch(outerError => { // Catch errors from createAssessment itself
        console.error("Error creating assessment:", outerError);
        setSaving(false)
        toast({
          variant: "destructive",
          title: "Error creating assessment.",
          description: outerError instanceof Error ? outerError.message : String(outerError),
        })
      })
    } else {
       // Provide feedback if required fields are missing
       toast({
         variant: "destructive",
         title: "Missing required fields.",
         description: "Please provide Project ID, Collection, and Name.",
       });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
            <div className="min-w-24 flex flex-col space-y-2">
              <Input
                type="text"
                placeholder={(assessmentType.projectType || "Project") + " ID"}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required // Add required attribute for browser validation
              />
              <Label>{assessmentType.projectType || "Project"} ID</Label>
            </div>
            <div className="min-w-48 flex flex-col space-y-2">
              <Select onValueChange={(value) => setCollectionId(value)} value={collectionId} required>
                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue
                    placeholder={"Select a collection"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assessmentCollections.map((collection: AssessmentCollection, key: number) =>
                    <SelectItem value={collection.id.toString()} key={key}>
                      {collection.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Label>Collection</Label>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required // Add required attribute
              />
              <Label>Name</Label>
            </div>
          </div>
          <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
            <div className="min-w-60 flex flex-col space-y-2">
              <Select onValueChange={(value) => setStatus(value)} value={status}>
                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue placeholder={status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned" key={0}>
                    Planned
                  </SelectItem>
                  <SelectItem value="Active" key={1}>
                    Active
                  </SelectItem>
                  <SelectItem value="Inactive" key={2}>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
              <Label>Status</Label>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Label>Location</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Label>Description</Label>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold max-lg:ml-2">Assessment Parts</h2>
          <PartsTable
            parts={parts}
            partsToAdd={partsToAdd}
            setPartsToAdd={setPartsToAdd}
          />
          <AssessmentAttributes
            parts={parts}
            attributesToAdd={attributesToAdd}
            setAttributesToAdd={setAttributesToAdd}
          />
        </div>
      </section>
      <section className="mb-16">
        <div className="flex flex-col items-center">
          <Button
            type="submit"
            disabled={
              saving ||
              // Keep disabled check simple, rely on form validation/toast for feedback
              attributesToAdd.length === 0
            }
          >
            {saving &&
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            } Add Assessment
          </Button>
        </div>
      </section>
    </form>
  )
}
