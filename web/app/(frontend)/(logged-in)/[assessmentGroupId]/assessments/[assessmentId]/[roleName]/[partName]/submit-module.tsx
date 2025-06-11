"use client"

import Link from "next/link"

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

export default function SubmitModule({
  urlHead,
  assessmentPartName
}: {
  readonly urlHead: string
  readonly assessmentPartName: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          Submit for Scoring
        </Button>
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