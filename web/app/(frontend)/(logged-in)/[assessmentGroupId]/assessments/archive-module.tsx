"use client"
import { Assessment, AssessmentUser } from "@/prisma/mssql/generated/client"
import { updateAssessment } from "../../utils/dataActions"

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
import { Archive } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ArchiveModule({ assessment, assessmentTypeId, assessmentUsers, buttonType } : { 
    assessment: Assessment, 
    assessmentTypeId: number,
    assessmentUsers: AssessmentUser[],
    buttonType: "icon" | "default"
}) {
    const router = useRouter()

    const handleArchive = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateAssessment(assessment.id, assessment.projectId, assessment.assessmentCollectionId, assessment.name, "Archived", assessment.location, assessment.description)
        router.push(`/${assessmentTypeId}/assessments`)
        toast({
            title: "Assessment archived successfully."
        })
    }

    return (
        (assessmentUsers?.length === 0 || assessment.status === "Final") ? 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size={buttonType}>
                        {buttonType === "icon" ? <Archive className="w-5 h-5 text-white" /> : "Archive Assessment"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to archive this assessment?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={(e: React.FormEvent) => handleArchive(e)}>
                                        Archive
                                    </Button>
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
        :  
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={buttonType} className="cursor-default opacity-50">
                            {buttonType === "icon" ? <Archive className="w-5 h-5 text-white" /> : "Archive Assessment"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to archive this assessment, it must either be finalized or have no assigned users.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
    )
}