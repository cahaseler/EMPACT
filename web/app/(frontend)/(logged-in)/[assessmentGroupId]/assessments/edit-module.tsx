"use client"

import { useState } from "react"

import { SquarePen, Loader } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import {
  AssessmentType,
  Assessment,
  AssessmentCollection
} from "@/prisma/mssql/generated/client"
import { updateAssessment } from "../../utils/dataActions"

export default function EditModule({
  assessmentType,
  assessment,
  assessmentCollections,
  canEditCollection,
  canEditStatus,
  buttonType
}: Readonly<{
  assessmentType: AssessmentType
  assessment: Assessment
  assessmentCollections: AssessmentCollection[]
  canEditCollection: boolean
  canEditStatus: boolean
  buttonType: "icon" | "default"
}>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  const [collectionId, setCollectionId] = useState<string | undefined>(
    assessment.assessmentCollectionId?.toString()
  )
  const collection = assessmentCollections.find(
    (collection: AssessmentCollection) =>
      collection.id === assessment.assessmentCollectionId
  )
  const [projectId, setProjectId] = useState<string>(assessment.projectId)
  const [name, setName] = useState<string>(assessment.name)
  const [status, setStatus] = useState<string>(assessment.status)
  const [location, setLocation] = useState<string>(assessment.location)
  const [description, setDescription] = useState<string>(assessment.description)

  const router = useRouter()

  const resetInfo = () => {
    setCollectionId(assessment.assessmentCollectionId?.toString())
    setProjectId(assessment.projectId)
    setName(assessment.name)
    setStatus(assessment.status)
    setLocation(assessment.location)
    setDescription(assessment.description)
  }

  const handleUpdateAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId !== "" && collectionId !== undefined && name !== "") {
      setSaving(true)
      updateAssessment(
        assessment.id,
        projectId,
        parseInt(collectionId, 10),
        name,
        status,
        location,
        description
      ).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: "Assessment updated successfully.",
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error updating assessment: ${error}`,
        })
      })
    }
  }

  return (
    <>
      <div className="flex justify-start">
        {buttonType === "icon" &&
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" onClick={() => setIsEditDialogOpen(true)}>
                  <SquarePen className="w-5 h-5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-center">
                Edit Assessment
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
        {buttonType === "default" &&
          <Button onClick={() => setIsEditDialogOpen(true)}>
            Edit Assessment
          </Button>
        }
      </div>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={() => {
          if (isEditDialogOpen) {
            setIsEditDialogOpen(false)
            resetInfo()
          } else {
            setIsEditDialogOpen(true)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Assessment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                {assessmentType.projectType || "Project"} ID
              </Label>
              <Input
                type="text"
                placeholder={(assessmentType.projectType || "Project") + " ID"}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                Collection
              </Label>
              <Select onValueChange={(value) => setCollectionId(value)} disabled={!canEditCollection}>
                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue
                    placeholder={collection ? collection.name : "Select an assessment collection"}
                    defaultValue={collectionId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assessmentCollections.map((collection, key) =>
                    <SelectItem value={collection.id.toString()} key={key}>
                      {collection.name}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                Name
              </Label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setStatus(value)} disabled={!canEditStatus}>
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
            </div>
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                Location
              </Label>
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <Label>Description</Label>
              <Textarea
                className="h-24 border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40 resize-none"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetInfo()
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateAssessment}
              disabled={
                saving ||
                projectId === "" ||
                collectionId === undefined ||
                name === ""
              }
            >
              {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}