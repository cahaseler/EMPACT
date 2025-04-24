"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
  AssessmentUser,
  AssessmentUserResponse,
  User,
} from "@/prisma/mssql/generated/client"
import { deleteAssessmentUser } from "../../../../utils/dataActions"

export default function DeleteModule({
  assessmentUser,
  assessmentTypeId,
  assessmentId
}: {
  readonly assessmentUser: AssessmentUser & {
    user: User & { assessmentUserResponse: AssessmentUserResponse[] }
  }
  readonly assessmentTypeId: number
  readonly assessmentId: number
}) {
  const router = useRouter()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteAssessmentUser(assessmentUser.id).then(() => {
      router.push(`/${assessmentTypeId}/users/assessment/${assessmentId}`)
      toast({
        title: "User successfully removed from assessment."
      })
    }).catch(error => {
      toast({
        title: `Error removing user from assessment: ${error}`
      })
    })
  }

  return assessmentUser.user.assessmentUserResponse.length > 0 ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" className="cursor-default opacity-50">
            <Trash2 className="w-5 h-5 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-60 text-center">
          This user cannot be removed because they have submitted responses to
          this assessment.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon">
                <Trash2 className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-60 text-center">
              Remove Assessment User
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove Assessment User
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col space-y-6 text center">
            <p>
              Are you sure you want to remove this user from this assessment?
            </p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
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
