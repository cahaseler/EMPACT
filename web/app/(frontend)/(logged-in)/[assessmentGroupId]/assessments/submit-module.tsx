"use client"

import { SquareCheck } from "lucide-react"
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
import { Assessment, AssessmentPart } from "@/prisma/mssql/generated/client"
import { updateAssessment, createAssessmentFinalizedDate } from "../../utils/dataActions"

export default function SubmitModule({
  assessment,
  buttonType
}: {
  readonly assessment: Assessment & { assessmentParts: AssessmentPart[] }
  readonly buttonType: "icon" | "default"
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
      assessment.location,
      assessment.description,
      new Date()
    ).then(async () => {
      await createAssessmentFinalizedDate(assessment.id).then(() => {
        router.refresh()
        toast({
          title: "Assessment submitted successfully.",
        })
      }).catch(error => {
        toast({
          title: `Error finalizing assessment: ${error}`
        })
      })
    }).catch(error => {
      toast({
        title: `Error finalizing assessment: ${error}`
      })
    })
  }

  const unfinalizedPart = assessment.assessmentParts.find(
    (part: AssessmentPart) => part.status !== "Final"
  )
  return unfinalizedPart || assessment.status === "Final" ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={buttonType} className="cursor-default opacity-50">
            {buttonType === "default" && "Finalize Assessment"}
            {buttonType === "icon" && <SquareCheck className="w-5 h-5 text-white" />}
          </Button>
        </TooltipTrigger>
        {unfinalizedPart &&
          <TooltipContent className="w-60 text-center">
            In order to finalize this assessment, all assessment parts must have
            been finalized.
          </TooltipContent>
        }
        {assessment.status === "Final" &&
          <TooltipContent className="w-60 text-center">
            This assessment has already been finalized.
          </TooltipContent>
        }
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AlertDialog>
      {buttonType === "icon" &&
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button size="icon">
                  <SquareCheck className="w-5 h-5 text-white" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="text-center">
              Finalize Assessment
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      {buttonType === "default" &&
        <AlertDialogTrigger asChild>
          <Button>
            Finalize Assessment
          </Button>
        </AlertDialogTrigger>
      }
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <AlertDialogTitle>Finalize Assessment</AlertDialogTitle>
            <p>
              Are you sure you want to finalize this assessment?
            </p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
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
