"use client"

import { useState } from "react"

import { SquarePen, Loader } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
    AssessmentPart,
    AssessmentUser,
    AssessmentUserGroup,
    Part,
    Permission,
    User
} from "@/prisma/mssql/generated/client"
import { updateAssessmentUser } from "../../../../utils/dataActions"

export default function EditModule({
    assessmentUser,
    groups,
    parts,
    permissions,
    canEditPermissions
}: Readonly<{
    assessmentUser: AssessmentUser & {
        user: User,
        participantParts: AssessmentPart[],
        permissions: Permission[]
    }
    groups: AssessmentUserGroup[]
    parts: (AssessmentPart & { part: Part })[]
    permissions: Permission[]
    canEditPermissions: boolean
}>) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const [role, setRole] = useState<string>(assessmentUser.role)
    const [groupId, setGroupId] = useState<number | null>(
        assessmentUser.assessmentUserGroupId
    )
    const [shouldFacParticipate, setShouldFacParticipate] = useState<boolean>(
        assessmentUser.role !== "Participant" &&
        assessmentUser.participantParts.length > 0
    )
    const partsToParticipate = parts.filter((part) => part.part.canFacParticipate)
    const [selectedParts, setSelectedParts] = useState<number[]>(
        assessmentUser.participantParts.map((part) => part.id)
    )
    const selectablePermissions =
        role === "Facilitator"
            ? permissions.filter(
                (permission) => permission.name !== "Archive assessment"
            )
            : permissions.filter(
                (permission) => permission.name === "Archive assessment"
            )
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        assessmentUser.permissions.map((permission) => permission.id)
    )

    const router = useRouter()

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        const partIds = selectedParts.map((partId) => ({ id: partId }))
        const permissionIds = selectedPermissions.map((permissionId) => ({
            id: permissionId,
        }))
        updateAssessmentUser(
            assessmentUser.id,
            role,
            groupId,
            partIds,
            permissionIds
        ).then(() => {
            setIsEditDialogOpen(false)
            setIsUpdating(false)
            router.refresh()
            toast({
                title: "Assessment user updated successfully.",
            })
        }).catch(error => {
            setIsEditDialogOpen(false)
            setIsUpdating(false)
            toast({
                title: `Error updating assessment user: ${error}`
            })
        })
    }

    return (
        <>
            <div className="flex justify-start">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" onClick={() => setIsEditDialogOpen(true)}>
                                <SquarePen className="w-5 h-5 text-white" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-center">
                            Edit Assessment User
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="mb-2">
                        <DialogTitle>Edit Assessment User</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-row justify-center items-center space-x-7">
                            <Label className="text-right">
                                Role
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    setRole(value)
                                    setSelectedPermissions([])
                                    if (value !== "Participant") {
                                        setGroupId(null)
                                    }
                                    else {
                                        setGroupId(groups?.[0]?.id ?? null) // Safely access id, fallback to null
                                        setShouldFacParticipate(false)
                                    }
                                }}
                                disabled={!canEditPermissions}
                            >
                                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                    <SelectValue placeholder={role} defaultValue={role} />
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
                        </div>
                        <div className="flex flex-row justify-center items-center space-x-4">
                            <Label className="text-right">
                                Group
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    setGroupId(parseInt(value, 10))
                                }}
                                disabled={groupId === null}
                            >
                                <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                    <SelectValue
                                        placeholder={
                                            groups.find((group) => group.id === groupId)?.name
                                        }
                                        defaultValue={groupId?.toString() || undefined}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupId !== null && groups.map((group) => (
                                        <SelectItem value={group.id.toString()} key={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {role !== "Participant" &&
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="flex flex-row space-x-2 items-center">
                                    <Checkbox
                                        checked={shouldFacParticipate}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setShouldFacParticipate(true)
                                                setGroupId(groups?.[0]?.id ?? null) // Safely access id, fallback to null
                                                if (partsToParticipate.length === 1)
                                                    setSelectedParts(partsToParticipate?.[0]?.id ? [partsToParticipate[0].id] : []) // Safely access id, fallback to empty array
                                            } else {
                                                setShouldFacParticipate(false)
                                                setGroupId(null)
                                                if (partsToParticipate.length === 1) setSelectedParts([])
                                            }
                                        }}
                                    />
                                    <Label>
                                        Will Facilitator Also Participate
                                        {partsToParticipate.length === 1 &&
                                            (partsToParticipate?.[0]?.part?.name ? ` in ${partsToParticipate[0].part.name}` : '')} {/* Safely access name, fallback to empty string */}
                                        ?
                                    </Label>
                                </div>
                                {shouldFacParticipate && partsToParticipate.length > 1 && (
                                    <div className="flex flex-col space-y-4">
                                        {parts
                                            .filter((part) => part.part.canFacParticipate)
                                            .map((part) => {
                                                return (
                                                    <div key={part.id} className="flex flex-row space-x-2">
                                                        <Checkbox
                                                            key={part.id}
                                                            checked={selectedParts.includes(part.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked)
                                                                    setSelectedParts([...selectedParts, part.id])
                                                                else
                                                                    setSelectedParts(
                                                                        selectedParts.filter(
                                                                            (partId) => partId !== part.id
                                                                        )
                                                                    )
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
                                )}
                            </div>
                        }
                        {role !== "Participant" &&
                            <div className="flex flex-col justify-center space-y-4">
                                <Label>
                                    Assessment Permissions
                                </Label>
                                <div className="flex flex-col space-y-4">
                                    {selectablePermissions.map((permission) => {
                                        return (
                                            <div
                                                key={permission.id}
                                                className="flex flex-row space-x-2 items-center"
                                            >
                                                <Checkbox
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked)
                                                            setSelectedPermissions([
                                                                ...selectedPermissions,
                                                                permission.id,
                                                            ])
                                                        else
                                                            setSelectedPermissions(
                                                                selectedPermissions.filter(
                                                                    (permissionId) =>
                                                                        permissionId !== permission.id
                                                                )
                                                            )
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
                    </div>
                    <DialogFooter className="mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleUpdateUser}
                            disabled={
                                isUpdating ||
                                ((role === "Participant" || shouldFacParticipate) &&
                                    groupId === null)
                            }
                        >
                            {isUpdating && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}