"use client"
import { Assessment } from "@/prisma/mssql/generated/client"
import { deleteAssessment } from "../../utils/dataActions"

import { Button } from "@/components/ui/button"
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
import { Trash2 } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function DeleteModule({ assessment, assessmentTypeId, buttonType } : { 
    assessment: Assessment, 
    assessmentTypeId: number,
    buttonType: "icon" | "default"
}) {
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteAssessment(assessment.id)
        router.push(`/${assessmentTypeId}/assessments`)
        toast({
            title: "Assessment deleted successfully."
        })
    }

    // TODO: Determine what conditions must be met for an assessment to be able to be deleted
    return (
        assessment ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={buttonType} className="cursor-default opacity-50">
                            {buttonType === "icon" ? <Trash2 className="w-5 h-5 text-white" /> : "Delete Assessment"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to delete this assessment, you must ???.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size={buttonType}>
                        {buttonType === "icon" ? <Trash2 className="w-5 h-5 text-white" /> : "Delete Assessment"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to delete this assessment?</p>
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