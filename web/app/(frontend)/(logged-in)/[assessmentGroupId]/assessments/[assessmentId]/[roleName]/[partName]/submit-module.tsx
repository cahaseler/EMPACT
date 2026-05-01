"use client"

import Link from "next/link"
import { BookCheck } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TooltipButton } from "@/components/ui/tooltip"

export default function SubmitModule({
  urlHead,
  assessmentPartName,
  buttonType
}: {
  readonly urlHead: string
  readonly assessmentPartName: string
  readonly buttonType: "icon" | "default"
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          {buttonType === "icon" ?
            <TooltipButton content="Submit for Scoring">
              <Button size="icon">
                <BookCheck className="w-5 h-5 text-white" />
              </Button>
            </TooltipButton> :
            <Button>Submit for Scoring</Button>
          }
        </span>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <AlertDialogTitle>Submit {assessmentPartName} Assessment for Scoring</AlertDialogTitle>
            <p>
              Are you sure you want to submit this assessment part for scoring?
            </p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <Link href={`${urlHead}/submit-assessment-part`}>
                <Button>
                  Submit
                </Button>
              </Link>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}