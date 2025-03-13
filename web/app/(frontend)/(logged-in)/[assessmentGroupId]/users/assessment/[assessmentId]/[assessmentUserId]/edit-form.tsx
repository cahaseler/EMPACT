"use client"
import { useState } from "react"
import { 
    User, 
    AssessmentUser, 
    AssessmentUserGroup, 
    AssessmentPart, 
    Part, 
    Permission 
} from "@/prisma/mssql/generated/client"
import { updateAssessmentUser } from "../../../../../utils/dataActions"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function EditForm({
  assessmentUser,
  groups,
  parts,
  permissions,
  canEditPermissions
}: Readonly<{
  assessmentUser: AssessmentUser & { 
    user: User, 
    permissions: Permission[], 
    participantParts: (AssessmentPart & { part: Part })[] 
  }
  groups: AssessmentUserGroup[]
  parts: (AssessmentPart & { part: Part })[]
  permissions: Permission[],
  canEditPermissions: boolean
}>) {
    const [role, setRole] = useState<string>(assessmentUser.role)
    const [groupId, setGroupId] = useState<number | null>(assessmentUser.assessmentUserGroupId)
    const [shouldFacParticipate, setShouldFacParticipate] = useState<boolean>(
        assessmentUser.role !== "Participant" && assessmentUser.participantParts.length > 0
    )
    const partsToParticipate = parts.filter(part => part.part.canFacParticipate)
    const [selectedParts, setSelectedParts] = useState<number[]>(assessmentUser.participantParts.map(part => part.id))
    const selectablePermissions = 
        role === "Facilitator" ? 
        permissions.filter(permission => permission.name !== "Archive assessment") : 
        permissions.filter(permission => permission.name === "Archive assessment")
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(assessmentUser.permissions.map(permission => permission.id))
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const partIds = selectedParts.map(partId => ({ id: partId }))
        const permissionIds = selectedPermissions.map(permissionId => ({ id: permissionId }))
        try {
            updateAssessmentUser(assessmentUser.id, role, groupId, partIds, permissionIds)
            .then(() => {
                setSaving(false)
                router.refresh()
                toast({
                    title: "Assessment user updated successfully."
                })
            })
        } catch(error) {
            setSaving(false)
            toast({
                title: `Error updating assessment user: ${error}`
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
                    <div className="md:w-1/2 flex flex-col space-y-2">
                        <Select 
                            onValueChange={(value) => {
                                setRole(value)
                                setSelectedPermissions([])
                                if (value !== "Participant") setGroupId(null)
                                else {
                                    setGroupId(groups[0].id)
                                    setShouldFacParticipate(false)
                                }
                            }}
                            disabled={!canEditPermissions}
                        >
                            <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                <SelectValue placeholder={role} defaultValue={role}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lead Facilitator" key={0}>
                                    Lead Facilitator
                                </SelectItem>
                                <SelectItem value="Facilitator" key={1}>
                                    Facilitator
                                </SelectItem>
                                <SelectItem value="Participant" key={2}>
                                    Participant
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Label>Role</Label>
                    </div>
                    <div className="md:w-1/2 flex flex-col space-y-2">
                        <Select 
                            onValueChange={(value) => {
                                setGroupId(parseInt(value, 10))
                            }}
                            disabled={role !== "Participant" && !shouldFacParticipate}
                        >
                            <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                <SelectValue 
                                    placeholder={groups.find(group => group.id === groupId)?.name} 
                                    defaultValue={groupId?.toString() || undefined}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem value={group.id.toString()} key={group.id}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Group</Label>
                    </div>
                </div>
                {role !== "Participant" && 
                    <>
                        <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
                            <div className="md:w-1/2 flex flex-row space-x-2 items-center">
                                <Checkbox 
                                    checked={shouldFacParticipate} 
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setShouldFacParticipate(true)
                                            setGroupId(groups[0].id)
                                            if (partsToParticipate.length === 1) setSelectedParts([partsToParticipate[0].id])
                                        }
                                        else {
                                            setShouldFacParticipate(false)
                                            setGroupId(null)
                                            if (partsToParticipate.length === 1) setSelectedParts([])
                                        }
                                    }} 
                                />
                                <Label>Will Facilitator Also Participate{partsToParticipate.length === 1 && ` in ${partsToParticipate[0].part.name}`}?</Label>
                            </div>
                            {shouldFacParticipate && partsToParticipate.length > 1 && 
                                <div className="md:w-1/2 flex flex-col space-y-4">
                                    {parts.filter(part => part.part.canFacParticipate).map((part) => {
                                        return (
                                            <div className="flex flex-row space-x-2">
                                            <Checkbox 
                                                key={part.id}
                                                checked={selectedParts.includes(part.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setSelectedParts([...selectedParts, part.id])
                                                    else setSelectedParts(selectedParts.filter(partId => partId !== part.id))
                                                }}
                                            />
                                            <Label className="text-black font-normal">
                                                {part.part.name}
                                            </Label>
                                            </div>
                                        )
                                    })}
                                    <Label>Participant Parts</Label>
                                </div>
                            }
                        </div>
                        {canEditPermissions && 
                            <div className="flex flex-col space-y-6">
                                <h2 className="text-2xl font-semibold">Assessment Permissions</h2>
                                <div className="flex flex-col max-md:space-y-4 md:flex-row md:justify-between">
                                    {selectablePermissions.map((permission) => {
                                        return (
                                            <div className="flex flex-row space-x-2 items-center">
                                                <Checkbox 
                                                    key={permission.id}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSelectedPermissions([...selectedPermissions, permission.id])
                                                        else setSelectedPermissions(selectedPermissions.filter(permissionId => permissionId !== permission.id))
                                                    }}
                                                />
                                                <Label className="text-black font-normal">
                                                    {permission.name}
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </>
                }
                <div className="flex flex-col items-center mt-8">
                    <Button type="submit" disabled={saving || ((role === "Participant" || shouldFacParticipate) && groupId === null)}>
                        {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Save Changes
                    </Button>
                </div>
            </div>
        </form>
    )
}