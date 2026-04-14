"use client"

import { Archive } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogPortalContent,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TooltipButton } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

import { Assessment } from "@/prisma/mssql/generated/client"
import { updateAssessment } from "../../utils/dataActions"

export default function ArchiveModule({
  assessment,
  assessmentTypeId,
  buttonType,
}: {
  readonly assessment: Assessment
  readonly assessmentTypeId: number
  readonly buttonType: "icon" | "default"
}) {
  const router = useRouter()

  const handleArchive = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateAssessment(
      assessment.id,
      assessment.projectId,
      assessment.assessmentCollectionId,
      assessment.name,
      "Archived",
      assessment.location,
      assessment.description
    )
    router.push(`/${assessmentTypeId}/assessments`)
    toast({
      title: "Assessment archived successfully.",
    })
  }

  return assessment.status !== "Active" ? (
    <AlertDialog>
      {buttonType === "icon" &&
        <TooltipButton content="Archive Assessment">
          <Button size="icon">
            <Archive className="w-5 h-5 text-white" />
          </Button>
        </TooltipButton>
      }
      {buttonType === "default" &&
        <AlertDialogTrigger asChild>
          <Button>
            Archive Assessment
          </Button>
        </AlertDialogTrigger>
      }
      <AlertDialogPortalContent
        title={`Archive ${assessment.name}`}
        description="Are you sure you want to archive this assessment?"
        actionName="Archive"
        action={(e: React.FormEvent) => handleArchive(e)}
      />
    </AlertDialog>
  ) : (
    <TooltipButton content="In order to archive this assessment, it must not be active." sizeLarge>
      <Button size={buttonType} className="cursor-default opacity-50">
        {buttonType === "icon" ? (
          <Archive className="w-5 h-5 text-white" />
        ) : (
          "Archive Assessment"
        )}
      </Button>
    </TooltipButton>
  )
}
