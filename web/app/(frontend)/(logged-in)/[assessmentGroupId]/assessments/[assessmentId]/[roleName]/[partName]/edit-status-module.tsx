"use client"

import { useState } from "react"

import {
  ToggleLeft,
  ToggleRight,
  Handshake,
  Loader
} from "lucide-react"

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

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { AssessmentPart } from "@/prisma/mssql/generated/client"
import { updateAssessmentPart } from "../../../../../utils/dataActions"

export default function EditStatusModule({
  urlHead,
  assessmentPart,
  buttonType
}: Readonly<{
  urlHead: string
  assessmentPart: AssessmentPart,
  buttonType: "icon" | "default"
}>) {
  const [saving, setSaving] = useState<boolean>(false)
  const [status, setStatus] = useState<string>(assessmentPart.status)

  const router = useRouter()

  const statusToSet = () => {
    switch (assessmentPart.status) {
      default:
        return [
          {
            status: "Inactive",
            icon: <ToggleRight className="w-5 h-5 text-white" />
          }
        ]
      case "Planned":
      case "Inactive":
        return [
          {
            status: "Active",
            icon: <ToggleLeft className="w-5 h-5 text-white" />
          }
        ]
      case "Final":
        return [
          {
            status: "Active",
            icon: <ToggleLeft className="w-5 h-5 text-white" />
          },
          {
            status: "Reconciliation",
            icon: <Handshake className="w-5 h-5 text-white" />
          }
        ]
    }
  }

  const handleUpdateAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (assessmentPart) {
      setSaving(true)
      updateAssessmentPart(
        assessmentPart.id,
        status,
        assessmentPart.date,
        assessmentPart.assessmentId,
        assessmentPart.partId,
      ).then(() => {
        setSaving(false)
        router.push(urlHead)
        toast({
          title: `Assessment part status set to ${status.toLowerCase()}`,
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error updating assessment part status: ${error}`,
        })
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center max-sm:space-y-2 sm:space-x-2">
      {statusToSet().map((status, key) =>
        <AlertDialog key={key}>
          <AlertDialogTrigger asChild>
            <span>
              {buttonType === "icon" ?
                <TooltipButton content={`Set Status to ${status.status}`}>
                  <Button onClick={() => setStatus(status.status)} size="icon">
                    {status.icon}
                  </Button>
                </TooltipButton> :
                <Button onClick={() => setStatus(status.status)}>
                  Set Status to {status.status}
                </Button>
              }
            </span>
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <div className="flex flex-col space-y-6 text center">
                <AlertDialogTitle>Set Status to {status.status}</AlertDialogTitle>
                <p>
                  Are you sure you want to set the status of this assessment part to {status.status.toLowerCase()}?
                </p>
                <div className="flex flex-row space-x-2 justify-end">
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <Button
                    type="submit"
                    onClick={handleUpdateAssessment}
                    disabled={saving}
                  >
                    {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Update Status
                  </Button>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      )}
    </div>
  )
}