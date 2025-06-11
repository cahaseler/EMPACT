"use client"

import { useState } from "react"

import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  AssessmentPart
} from "@/prisma/mssql/generated/client"
import { updateAssessmentPart, deleteScoreSummaries } from "../../../../../../utils/dataActions"

export default function EditForm({
  assessmentPart
}: Readonly<{
  assessmentPart: AssessmentPart,
}>) {
  const [status, setStatus] = useState<string>(assessmentPart.status)
  const [date, setDate] = useState<Date>(assessmentPart.date)
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    updateAssessmentPart(
      assessmentPart.id,
      status,
      date,
      assessmentPart.assessmentId,
      assessmentPart.partId,
    ).then(() => {
      if (assessmentPart.status === "Final" && status !== "Final") {
        deleteScoreSummaries(assessmentPart.id).then(() => {
          setSaving(false)
          router.refresh()
          toast({
            title: "Assessment part updated successfully.",
          })
        }).catch(error => {
          setSaving(false)
          toast({
            title: `Error updating assessment part: ${error}`,
          })
        })
      } else {
        setSaving(false)
        router.refresh()
        toast({
          title: "Assessment part updated successfully.",
        })
      }
    }).catch(error => {
      setSaving(false)
      toast({
        title: `Error updating assessment part: ${error}`,
      })
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4">
          <div className="w-1/2 flex flex-col space-y-2">
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                <SelectValue placeholder={status} defaultValue={status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned" key={0}>
                  Planned
                </SelectItem>
                <SelectItem value="Active" key={1}>
                  Active
                </SelectItem>
                <SelectItem value="Inactive" key={2}>
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
            <Label>Status</Label>
          </div>
          <div className="w-1/2 flex flex-col space-y-2">
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
            <Label>Date</Label>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Button type="submit" disabled={saving}>
            {saving &&
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            } Save Changes to Assessment Part Info
          </Button>
        </div>
      </div>
    </form>
  )
}
