"use client"
import { 
    AssessmentType, 
    AssessmentCollection,
    Assessment
} from "@/prisma/mssql/generated/client"
import { updateAssessmentCollection, deleteAssessmentCollection } from "../../../utils/dataActions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    collection, 
    assessmentType,
    isAdmin
}: {
    readonly collection: AssessmentCollection & { assessments: Assessment[] }, 
    readonly assessmentType: AssessmentType,
    readonly isAdmin: boolean
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(collection.name)
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleUpdate = async (e: React.FormEvent) => {
        if(name !== "") {
            e.preventDefault()
            setSaving(true)
            await updateAssessmentCollection(collection.id, name, assessmentType.id).then(() => {
                setSaving(false)
                router.refresh()
            })
        }
    }

    return (
        <TableRow key={collection.id}>
            <TableCell>{collection.id}</TableCell>
            <TableCell>
                {isEditing ? 
                    <Input 
                        type="text" 
                        placeholder="Collection Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40"
                    /> 
                    : collection.name
                }
            </TableCell>
            <TableCell>
                <ul className="list-none">
                    {collection.assessments.map(assessment => 
                        <li key={assessment.id}>{assessment.name}</li>
                    )}
                </ul>
            </TableCell>
            <TableCell>
                <div className="grid grid-cols-2 gap-2 w-20">
                    {!isEditing ? <>
                        <Button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center w-9 h-9 p-0 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
                        >
                            <SquarePen className="w-5 h-5 text-white" />
                        </Button>
                        {isAdmin && <DeleteModule collection={collection} />}
                    </> : <>
                        <Button 
                            onClick={() => {
                                setIsEditing(false)
                                setName(collection.name)
                            }}
                            className="flex items-center justify-center w-9 h-9 p-0 rounded-md border-indigo-700/90 bg-transparent hover:bg-transparent border-[3px] hover:border-indigo-700/70 text-indigo-700/90 hover:text-indigo-700/70"
                        >
                            <X className="w-5 h-5 stroke-[3px]" />
                        </Button>
                        {isAdmin && 
                            <Button 
                                onClick={(e: React.FormEvent) => handleUpdate(e)}
                                className="flex items-center justify-center w-9 h-9 p-0 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
                            >
                                {saving ? <Loader className="h-5 w-5 animate-spin"/> : <Save className="w-5 h-5 text-white" />}
                            </Button>
                        }
                    </>
                    }
                </div>
            </TableCell>
        </TableRow>
    )
}

function DeleteModule({collection} : {collection: AssessmentCollection & {assessments: Assessment[]}}) {
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteAssessmentCollection(collection.id)
        router.refresh()
    }

    return (
        collection.assessments.length > 0 ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            className="flex items-center justify-center w-9 h-9 p-0 rounded-md cursor-auto bg-indigo-700/50 hover:bg-indigo-700/50"
                        >
                            <Trash2 className="w-5 h-5 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to delete this assessment collection, you must delete or reassign any associated assessments.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        className="flex items-center justify-center w-9 h-9 p-0 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
                    >
                        <Trash2 className="w-5 h-5 text-white" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to delete this assessment collection?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button 
                                        className="inline-flex items-center justify-center rounded-md border-indigo-700/90 bg-transparent hover:bg-transparent border-2 hover:border-indigo-700/70 text-indigo-700/90 hover:text-indigo-700/70 px-8 py-4 text-wrap text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button 
                                        onClick={(e: React.FormEvent) => handleDelete(e)} 
                                        className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-4 text-wrap text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    >
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