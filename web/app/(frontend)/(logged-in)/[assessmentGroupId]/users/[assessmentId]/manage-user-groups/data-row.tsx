"use client"
import { 
    User,
    AssessmentUserGroup,
    AssessmentUser
} from "@/prisma/mssql/generated/client"
import { updateAssessmentUserGroup, deleteAssessmentUserGroup } from "../../../../utils/dataActions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { 
    TooltipProvider, 
    Tooltip, 
    TooltipTrigger, 
    TooltipContent 
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { 
    SquarePen, 
    Trash2,
    X,
    Save,
    Loader
} from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    group
}: {
    readonly group: AssessmentUserGroup & { assessmentUser: (AssessmentUser & { user: User })[] }
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(group.name)
    const [status, setStatus] = useState<string>(group.status)
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleUpdate = async (e: React.FormEvent) => {
        if(name !== "") {
            e.preventDefault()
            setSaving(true)
            await updateAssessmentUserGroup(group.id, name, status).then(() => {
                setSaving(false)
                router.refresh()
                toast({
                    title: "User group updated successfully."
                })
            })
        }
    }

    return (
        <TableRow key={group.id}>
            <TableCell>{group.id}</TableCell>
            <TableCell>
                {isEditing ? 
                    <Input 
                        type="text" 
                        placeholder="Group Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    /> 
                    : group.name
                }
            </TableCell>
            <TableCell>
                {isEditing ? 
                    <Select 
                        onValueChange={(value) => setStatus(value)}
                    >
                        <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                            <SelectValue placeholder={status} defaultValue={status}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active" key={0}>
                                Active
                            </SelectItem>
                            <SelectItem value="Inactive" key={1}>
                                Inactive
                            </SelectItem>
                        </SelectContent>
                    </Select> 
                : 
                    group.status
                }
            </TableCell>
            <TableCell>
                {group.assessmentUser.length}
            </TableCell>
            <TableCell>
                <div className="grid grid-cols-2 gap-2 w-20">
                    {!isEditing ? <>
                        <Button 
                            onClick={() => setIsEditing(true)}
                            size="icon"
                        >
                            <SquarePen className="w-5 h-5 text-white" />
                        </Button>
                        <DeleteModule group={group} />
                    </> : <>
                        <Button 
                            onClick={() => {
                                setIsEditing(false)
                                setName(group.name)
                            }}
                            variant="outline"
                            size="icon"
                            className="border-[3px]"
                        >
                            <X className="w-5 h-5 stroke-[3px]" />
                        </Button>
                        <Button 
                            onClick={(e: React.FormEvent) => handleUpdate(e)}
                            size="icon"
                        >
                            {saving ? <Loader className="h-5 w-5 animate-spin"/> : <Save className="w-5 h-5 text-white" />}
                        </Button>
                    </>
                    }
                </div>
            </TableCell>
        </TableRow>
    )
}

function DeleteModule({ group } : { group: AssessmentUserGroup & { assessmentUser: AssessmentUser[] } }) {
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteAssessmentUserGroup(group.id)
        router.refresh()
        toast({
            title: "User group deleted successfully."
        })
    }

    return (
        group.assessmentUser.length > 0 ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="default" size="icon" className="cursor-default opacity-50">
                            <Trash2 className="w-5 h-5 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to delete this user group, you must delete or reassign any associated assessment users.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="icon">
                        <Trash2 className="w-5 h-5 text-white" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to delete this user group?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={(e: React.FormEvent) => handleDelete(e)}>
                                        Delete
                                    </Button>
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
    )
}