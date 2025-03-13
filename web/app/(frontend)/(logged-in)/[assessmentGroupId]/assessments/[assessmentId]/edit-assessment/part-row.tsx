"use client"
import { AssessmentPart, Part } from "@/prisma/mssql/generated/client"
import { updateAssessmentPart } from "../../../../utils/dataActions"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
    SquareCheckBig,
    X,
    Save,
    Loader
} from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function DataTable({
    assessmentId, 
    assessmentPart,
    canEditStatus,
    unfinishedPart
}: {
    readonly assessmentId: number,
    readonly assessmentPart: AssessmentPart & { part: Part }
    readonly canEditStatus: boolean
    readonly unfinishedPart: boolean
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [status, setStatus] = useState<string>(assessmentPart.status)
    const [date, setDate] = useState<Date>(assessmentPart.date)
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleUpdate = async (e: React.FormEvent) => {
        if(status !== "") {
            e.preventDefault()
            setSaving(true)
            await updateAssessmentPart(assessmentPart.id, status, assessmentId, assessmentPart.part.id).then(() => {
                setSaving(false)
                router.refresh()
                toast({
                    title: "Assessment part updated successfully."
                })
            })
        }
    }

    return (
        <TableRow key={assessmentPart.id}>
            <TableCell>{assessmentPart.id}</TableCell>
            <TableCell>{assessmentPart.part.name}</TableCell>
            <TableCell>
                {isEditing ? 
                    <Select onValueChange={(value) => setStatus(value)}>
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
                    : status
                }
            </TableCell>
            <TableCell>
                {isEditing ? 
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="dateInput" size="offset" disabled={!canEditStatus}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "MM/dd/yyyy") : <span>Select date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                    if (selectedDate !== undefined) {
                                        setDate(selectedDate)
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    : format(date, "MM/dd/yyyy")
                }
            </TableCell>
            {canEditStatus && 
                <TableCell>
                    <div className="grid grid-cols-2 gap-2 w-20">
                        {!isEditing ? <>
                            <Button 
                                onClick={() => setIsEditing(true)}
                                size="icon"
                            >
                                <SquarePen className="w-5 h-5 text-white" />
                            </Button>
                            <SubmitModule 
                                assessmentId={assessmentId} 
                                assessmentPart={assessmentPart} 
                                unfinishedPart={unfinishedPart} 
                            />
                        </> : <>
                            <Button 
                                onClick={() => {
                                    setIsEditing(false)
                                    setStatus(assessmentPart.status)
                                    setDate(assessmentPart.date)
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
            }
        </TableRow>
    )
}

function SubmitModule({
    assessmentId, 
    assessmentPart,
    unfinishedPart
} : {
    readonly assessmentId: number,
    readonly assessmentPart: AssessmentPart & { part: Part },
    readonly unfinishedPart: boolean
}) {
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateAssessmentPart(assessmentPart.id, "Submitted", assessmentId, assessmentPart.part.id).then(() => {
            router.refresh()
            toast({
                title: "Assessment part submitted successfully."
            })
        })
    }

    return (
        unfinishedPart ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="default" size="icon" className="cursor-default opacity-50">
                            <SquareCheckBig className="w-5 h-5 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to submit this assessment part for scoring, reponses from all participants to all {assessmentPart.part.attributeType.toLowerCase()}s must have been submitted.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="icon">
                        <SquareCheckBig className="w-5 h-5 text-white" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to submit this assessment part for scoring?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={(e: React.FormEvent) => handleSubmit(e)}>
                                        Submit for Scoring
                                    </Button>
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
    )
}