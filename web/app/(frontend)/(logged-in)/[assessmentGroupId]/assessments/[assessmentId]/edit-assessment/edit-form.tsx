"use client"
import { useState } from "react"
import { AssessmentType, AssessmentCollection, Assessment } from "@/prisma/mssql/generated/client"
import { updateAssessment } from "../../../../utils/dataActions"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function EditForm({
  assessmentType,
  assessment, 
  assessmentCollections,
  canEditCollection,
  canEditStatus
}: Readonly<{
  assessmentType: AssessmentType,
  assessment: Assessment, 
  assessmentCollections: AssessmentCollection[],
  canEditCollection: boolean,
  canEditStatus: boolean
}>) {
    const [collectionId, setCollectionId] = useState<string | undefined>(assessment.assessmentCollectionId?.toString())
    const collection = assessmentCollections.find((collection: AssessmentCollection) => collection.id === assessment.assessmentCollectionId)
    const [projectId, setProjectId] = useState<string>(assessment.projectId)
    const [name, setName] = useState<string>(assessment.name)
    const [status, setStatus] = useState<string>(assessment.status)
    const [location, setLocation] = useState<string>(assessment.location)
    const [description, setDescription] = useState<string>(assessment.description)
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (projectId !== "" && collectionId !== undefined && name !== "") {
            setSaving(true)
            try {
                updateAssessment(assessment.id, projectId, parseInt(collectionId, 10), name, status, location, description).then(() => {
                    setSaving(false)
                    router.refresh()
                    toast({
                      title: "Assessment updated successfully."
                    })
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
                <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
                    <div className="min-w-24 flex flex-col space-y-2">
                        <Input 
                            type="text" 
                            placeholder={(assessmentType.projectType || "Project") + " ID"} 
                            value={projectId} 
                            onChange={(e) => setProjectId(e.target.value)} 
                        />
                        <Label>{assessmentType.projectType || "Project"} ID</Label>
                    </div>
                    <div className="min-w-40 flex flex-col space-y-2">
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
                        <Select onValueChange={(value) => setStatus(value)} disabled={!canEditStatus}>
                            <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                <SelectValue placeholder={status} defaultValue={status}/>
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
                <div className="flex flex-col items-center">
                    <Button type="submit" disabled={saving || projectId === "" || collectionId === undefined || name === ""}>
                        {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Save Changes
                    </Button>
                </div>
            </div>
        </form>
    )
}