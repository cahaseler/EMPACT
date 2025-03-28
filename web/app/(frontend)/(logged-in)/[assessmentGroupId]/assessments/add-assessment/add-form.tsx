"use client"

import { useState } from "react"

import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  Part,
} from "@/prisma/mssql/generated/client"
import {
  createAssessment,
  createAssessmentPart,
} from "../../../utils/dataActions"
import PartsTable from "./parts-table"

type AssessmentPartToAdd = {
  partId: number
  status: string
  date: Date
}

export default function AddForm({
  assessmentCollections,
  parts,
}: Readonly<{
  readonly assessmentCollections: AssessmentCollection[]
  readonly parts: Part[]
}>) {
  const [collectionId, setCollectionId] = useState<string | undefined>("")
  const [projectId, setProjectId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [status, setStatus] = useState<string>("Planned")
  const [location, setLocation] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [partsToAdd, setPartsToAdd] = useState<AssessmentPartToAdd[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId !== "" && collectionId !== undefined && name !== "") {
      setSaving(true)
      try {
        createAssessment(
          projectId,
          parseInt(collectionId, 10),
          name,
          status,
          location,
          description
        ).then(async (assessment: Assessment) => {
          for (let i = 0; i < partsToAdd.length; i++) {
            await createAssessmentPart(
              partsToAdd[i].status,
              partsToAdd[i].date,
              assessment.id,
              partsToAdd[i].partId
            )
          }
          setSaving(false)
          router.refresh()
          toast({
            title: "Assessment created successfully.",
          })
        })
      } catch (error) {
        toast({
          title: `Error creating assessment: ${error}`,
        })
      }
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
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <Label>Project ID</Label>
            </div>
            <div className="min-w-40 flex flex-col space-y-2">
              <Select onValueChange={(value) => setCollectionId(value)}>
                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue
                    placeholder={"Select a collection"}
                    defaultValue={collectionId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assessmentCollections.map(
                    (collection: AssessmentCollection, key: number) => (
                      <SelectItem value={collection.id.toString()} key={key}>
                        {collection.name}
                      </SelectItem>
                    )
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
              />
              <Label>Name</Label>
            </div>
          </div>
          <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
            <div className="min-w-60 flex flex-col space-y-2">
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue placeholder={status} defaultValue={status} />
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
        </div>
      </section>
      <section className="mb-16">
        <div className="flex flex-col items-center">
          <Button
            type="submit"
            disabled={
              saving ||
              projectId === "" ||
              collectionId === undefined ||
              name === ""
            }
          >
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Add
            Assessment
          </Button>
        </div>
      </section>
    </form>
  )
}
