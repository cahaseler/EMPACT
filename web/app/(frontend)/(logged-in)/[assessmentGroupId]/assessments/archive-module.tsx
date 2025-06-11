"use client"

import { Archive } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
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
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon">
                <Archive className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-center">
              Archive Assessment
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      {buttonType === "default" &&
        <AlertDialogTrigger asChild>
          <Button>
            Archive Assessment
          </Button>
        </AlertDialogTrigger>
      }
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <AlertDialogTitle>
              Archive {assessment.name}
            </AlertDialogTitle>
            <p>Are you sure you want to archive this assessment?</p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
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
  ) : (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={buttonType} className="cursor-default opacity-50">
            {buttonType === "icon" ? (
              <Archive className="w-5 h-5 text-white" />
            ) : (
              "Archive Assessment"
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-60 text-center">
          In order to archive this assessment, it must not be active.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
