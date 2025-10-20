"use client"

import { useState, useRef } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Level
} from "@/prisma/mssql/generated/client"
import {
  upsertAssessmentUserResponse,
} from "../../../../../../../utils/dataActions"

export default function AttributeUserResponse({
  assessment,
  groups,
  userId,
  attributeId,
  levels,
  userResponses,
  isFacilitator
}: {
  readonly assessment: Assessment
  readonly groups: (AssessmentUserGroup & { assessmentUser: (AssessmentUser)[] })[]
  readonly userId: string | undefined
  readonly attributeId: string
  readonly levels: Level[]
  readonly userResponses: AssessmentUserResponse[]
  readonly isFacilitator: boolean
}) {
  const assessmentUserGroupId = groups.find(
    (group) => group.assessmentUser.find(
      (assessmentUser: AssessmentUser) => userId && assessmentUser.userId === parseInt(userId, 10)
    )
  )?.id
  const [groupId, setGroupId] = useState<number | null>(
    !isFacilitator ? (assessmentUserGroupId || null) : (groups[0] ? groups[0].id : null)
  )
  const userResponse = userResponses.find((userResponse) => userResponse.assessmentUserGroupId === groupId)
  const [levelId, setLevelId] = useState<number | undefined>(userResponse?.levelId)
  const [notes, setNotes] = useState<string>(userResponse?.notes || "")
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (userId && levelId && notes !== "") {
      await upsertAssessmentUserResponse(
        assessment.id,
        parseInt(userId, 10),
        groupId || 0,
        attributeId,
        levelId,
        notes
      ).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: `Response for group ${groupId} saved successfully.`,
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
      <section className="mb-8 flex flex-col justify-center">
        {isFacilitator &&
          <div className="w-full flex flex-col items-end">
            <div className="flex flex-col space-y-2 w-1/3 sm:w-1/4">
              <Select
                onValueChange={(value) => {
                  setGroupId(parseInt(value, 10))
                  const userResponse = userResponses.find(
                    (userResponse) => userResponse.assessmentUserGroupId === parseInt(value, 10)
                  )
                  setLevelId(undefined)
                  setLevelId(userResponse?.levelId)
                  setNotes(userResponse?.notes || "")
                }}
              >
                <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                  <SelectValue
                    placeholder={groups[0] ? groups[0].name : "Select Group"}
                    defaultValue={groups[0] && groups[0].id}
                  />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem value={group.id.toString()} key={group.id}>
                      {group.name.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-right">
                User Group: {groupId}
              </Label>
            </div>
          </div>
        }
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold max-lg:ml-2">Rating</h2>
          <div className="w-1/3 sm:w-1/4 lg:w-1/6">
            <Select
              value={levelId?.toString()}
              onValueChange={(value) => {
                setLevelId(parseInt(value, 10))
              }}
            >
              <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                <SelectValue
                  placeholder={
                    levels.find(
                      (level: Level) => level.id === levelId
                    )?.level.toString() ||
                    "Select Rating"
                  }
                  defaultValue={levelId?.toString()}
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
        </div>
      </section>
      <section className="mb-8 flex flex-col space-y-4 justify-center">
        <h2 className="text-2xl font-bold max-lg:ml-2">Comments</h2>
        <Textarea
          className="h-40 border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40 resize-none"
          placeholder="Notes for rating (required)"
          value={notes}
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
