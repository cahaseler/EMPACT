"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogPortalContent,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TooltipButton } from "@/components/ui/tooltip"
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
    <TooltipButton
      content="This user cannot be removed because they have submitted responses to this assessment."
      sizeLarge
    >
      <Button size="icon" className="cursor-default opacity-50">
        <Trash2 className="w-5 h-5 text-white" />
      </Button>
    </TooltipButton>
  ) : (
    <AlertDialog>
      <TooltipButton content="Remove Assessment User">
        <AlertDialogTrigger asChild>
          <Button size="icon">
            <Trash2 className="w-5 h-5 text-white" />
          </Button>
        </AlertDialogTrigger>
      </TooltipButton>
      <AlertDialogPortalContent
        title="Remove Assessment User"
        description="Are you sure you want to remove this user from this assessment?"
        actionName="Remove"
        action={(e: React.FormEvent) => handleDelete(e)}
      />
    </AlertDialog>
  )
}
