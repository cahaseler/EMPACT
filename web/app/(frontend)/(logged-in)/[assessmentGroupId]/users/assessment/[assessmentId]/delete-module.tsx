"use client"
import { User, AssessmentUser, AssessmentUserResponse } from "@/prisma/mssql/generated/client"
import { deleteAssessmentUser } from "../../../../utils/dataActions"

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

export default function DeleteModule({ assessmentUser, assessmentTypeId, assessmentId, buttonType } : { 
    assessmentUser: AssessmentUser & { user: User & { assessmentUserResponse: AssessmentUserResponse[] } }, 
    assessmentTypeId: number,
    assessmentId: number,
    buttonType: "icon" | "default"
}) {
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteAssessmentUser(assessmentUser.id)
        router.push(`/${assessmentTypeId}/users/${assessmentId}`)
        toast({
            title: "User successfully removed from assessment."
        })
    }

    return (
        assessmentUser.user.assessmentUserResponse.length > 0 ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={buttonType} className="cursor-default opacity-50">
                            {buttonType === "icon" ? <Trash2 className="w-5 h-5 text-white" /> : "Remove User from Assessment"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        This user cannot be removed because they have submitted responses to this assessment.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size={buttonType}>
                        {buttonType === "icon" ? <Trash2 className="w-5 h-5 text-white" /> : "Remove User from Assessment"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to remove this user from this assessment?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={(e: React.FormEvent) => handleDelete(e)}>
                                        Remove
                                    </Button>
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
    )
}