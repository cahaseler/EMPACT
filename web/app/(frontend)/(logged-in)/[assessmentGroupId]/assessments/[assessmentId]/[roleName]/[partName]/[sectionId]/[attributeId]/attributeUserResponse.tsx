"use client"

import { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Assessment,
  AssessmentUserResponse,
  Level,
} from "@/prisma/mssql/generated/client"
import {
  upsertAssessmentUserResponse,
} from "../../../../../../../utils/dataActions"

export default function AttributeUserResponse({
  assessment,
  userId,
  attributeId,
  levels,
  userResponse,
}: {
  readonly assessment: Assessment
  readonly userId: string | undefined
  readonly attributeId: string
  readonly levels: Level[]
  readonly userResponse: AssessmentUserResponse | undefined
}) {
  const userResponseLevel = levels.find(
    (level: Level) => level.id === userResponse?.levelId
  )
  const [levelId, setLevelId] = useState<number | undefined>(
    userResponseLevel ? userResponseLevel.id : undefined
  )
  const [notes, setNotes] = useState<string>(
    userResponse ? userResponse.notes : ""
  )
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (userId && levelId && notes !== "") {
      await upsertAssessmentUserResponse(
        assessment.id,
        parseInt(userId, 10),
        attributeId,
        levelId,
        notes
      ).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: "Response saved successfully.",
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error saving response: ${error}`
        })
      })
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="mb-8 flex flex-col space-y-4 justify-center">
        <h2 className="text-2xl font-bold max-lg:ml-2">Rating</h2>
        <div className="w-1/3 sm:w-1/4 lg:w-1/6">
          <Select
            onValueChange={(value) => {
              setLevelId(parseInt(value, 10))
            }}
          >
            <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
              <SelectValue
                placeholder={
                  userResponseLevel
                    ? userResponseLevel.level.toString()
                    : "Select Rating"
                }
                defaultValue={levelId && levelId.toString()}
              />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level: Level) => (
                <SelectItem value={level.id.toString()} key={level.level}>
                  {level.level.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="mb-8 flex flex-col space-y-4 justify-center">
        <h2 className="text-2xl font-bold max-lg:ml-2">Comments</h2>
        <Textarea
          className="h-40 border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40 resize-none"
          placeholder="Notes for rating (required)"
          defaultValue={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>
      {assessment.status === "Active" && (
        <section className="mb-8 flex justify-center">
          <Button
            type="submit"
            disabled={saving || !levelId || notes === ""}
            size="lg"
          >
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save
            Response
          </Button>
        </section>
      )}
    </form>
  )
}
