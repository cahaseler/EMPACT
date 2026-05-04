"use client"

import { useState } from "react"

import { format } from "date-fns"
import {
  Calendar as CalendarIcon,
  Loader
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TooltipButton } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import { AssessmentPart } from "@/prisma/mssql/generated/client"
import { updateAssessmentPart } from "../../../../../utils/dataActions"

export default function EditDateModule({
  assessmentPart,
  buttonType
}: Readonly<{
  assessmentPart: AssessmentPart,
  buttonType: "icon" | "default"
}>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  const [date, setDate] = useState<Date>(assessmentPart.date)

  const router = useRouter()

  const handleUpdateAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (date !== undefined) {
      setSaving(true)
      updateAssessmentPart(
        assessmentPart.id,
        assessmentPart.status,
        date,
        assessmentPart.assessmentId,
        assessmentPart.partId,
      ).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: "Assessment part date updated successfully.",
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error updating assessment part date: ${error}`,
        })
      })
    }
  }

  return (
    <>
      <div className="flex justify-start">
        {buttonType === "icon" &&
          <TooltipButton content="Edit Assessment Part Date">
            <Button size="icon" onClick={() => setIsEditDialogOpen(true)}>
              <CalendarIcon className="w-5 h-5 text-white" />
            </Button>
          </TooltipButton>
        }
        {buttonType === "default" &&
          <Button onClick={() => setIsEditDialogOpen(true)}>
            Edit Assessment Part Date
          </Button>
        }
      </div>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={() => {
          if (isEditDialogOpen) {
            setIsEditDialogOpen(false)
            setDate(assessmentPart.date)
          } else {
            setIsEditDialogOpen(true)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Assessment Part Date</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row justify-center items-center space-x-4">
              <Label className="w-24 text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="dateInput"
                    size="offset"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MM/dd/yyyy") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate !== undefined) {
                        setDate(selectedDate)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setDate(assessmentPart.date)
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateAssessment}
              disabled={saving || date === undefined}
            >
              {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}