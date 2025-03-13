"use client"
import { 
    Assessment,
    AssessmentPart,
    Part
} from "@/prisma/mssql/generated/client"
import { updateAssessment } from "../../../../utils/dataActions"

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

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function SubmitModule({ assessment } : {
    readonly assessment: Assessment & { assessmentParts: AssessmentPart[] }
}) {
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateAssessment(
            assessment.id, 
            assessment.projectId, 
            assessment.assessmentCollectionId,
            assessment.name, 
            "Final", 
            assessment.date, 
            assessment.description
        ).then(() => {
            router.refresh()
            toast({
                title: "Assessment part submitted successfully."
            })
        })
    }

    const unfinalizedPart = assessment.assessmentParts.find((part: AssessmentPart) => part.status !== "Final")
    return (
        unfinalizedPart ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="cursor-default opacity-50">
                            Finalize Assessment
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to finalize this assessment, all assessment parts must have been finalized.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button>
                        Finalize Assessment
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to finalize this assessment? No further changes to the assessment will be able to be made.</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={(e: React.FormEvent) => handleSubmit(e)}>
                                        Finalize
                                    </Button>
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
    )
}