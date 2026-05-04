"use client"

import { useState } from "react"

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
  AssessmentUserReconciliation,
  AssessmentUserResponse,
  Level
} from "@/prisma/mssql/generated/client"
import {
  upsertAssessmentUserReconciliation,
  upsertAssessmentUserResponse
} from "../../../../../../../utils/dataActions"

export default function AttributeUserResponse({
  assessmentId,
  assessmentPartStatus,
  groups,
  userId,
  attributeId,
  levels,
  userResponses,
  userReconciliations,
  isFacilitator
}: {
  readonly assessmentId: number
  readonly assessmentPartStatus: string
  readonly groups: (AssessmentUserGroup & { assessmentUser: (AssessmentUser)[] })[]
  readonly userId: string | undefined
  readonly attributeId: string
  readonly levels: Level[]
  readonly userResponses: AssessmentUserResponse[]
  readonly userReconciliations: AssessmentUserReconciliation[]
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

  const userResponse = userResponses.find(
    (userResponse) =>
      userId && userResponse.userId === parseInt(userId, 10) &&
      userResponse.assessmentUserGroupId === groupId
  )
  const [resLevelId, setResLevelId] = useState<number | undefined>(userResponse?.levelId)
  const [resNotes, setResNotes] = useState<string>(userResponse?.notes || "")

  const userReconciliation = userReconciliations.find(
    (userReconciliation) =>
      userId && userReconciliation.userId === parseInt(userId, 10) &&
      userReconciliation.assessmentUserGroupId === groupId
  )
  const [recLevelId, setRecLevelId] = useState<number | undefined>(userReconciliation?.levelId)
  const [recNotes, setRecNotes] = useState<string>(userReconciliation?.notes || "")

  const showRec = assessmentPartStatus === "Reconciliation" || (assessmentPartStatus === "Final" && userReconciliation)

  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (assessmentPartStatus === "Active") {
      if (userId && resLevelId && resNotes !== "") {
        await upsertAssessmentUserResponse(
          assessmentId,
          parseInt(userId, 10),
          groupId || 0,
          attributeId,
          resLevelId,
          resNotes
        ).then(() => {
          setSaving(false)
          router.refresh()
          toast({
            title: `Response saved successfully.`,
          })
        }).catch(error => {
          setSaving(false)
          toast({
            title: `Error saving response: ${error}`
          })
        })
      }
    } else if (assessmentPartStatus === "Reconciliation") {
      if (userId && recLevelId) {
        await upsertAssessmentUserReconciliation(
          assessmentId,
          parseInt(userId, 10),
          groupId || 0,
          attributeId,
          recLevelId,
          recNotes
        ).then(() => {
          setSaving(false)
          router.refresh()
          toast({
            title: `Reconciliation response saved successfully.`,
          })
        }).catch(error => {
          setSaving(false)
          toast({
            title: `Error saving reconciliation response: ${error}`
          })
        })
      }
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
                  if (showRec) {
                    setRecLevelId(undefined)
                    setRecLevelId(userReconciliation?.levelId)
                    setRecNotes(userReconciliation?.notes || "")
                  } else {
                    setResLevelId(undefined)
                    setResLevelId(userResponse?.levelId)
                    setResNotes(userResponse?.notes || "")
                  }
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
              value={showRec ? recLevelId?.toString() : resLevelId?.toString()}
              onValueChange={(value) => {
                showRec ? setRecLevelId(parseInt(value, 10)) : setResLevelId(parseInt(value, 10))
              }}
            >
              <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                <SelectValue
                  placeholder={
                    levels.find((level: Level) =>
                      showRec ? level.id === recLevelId : level.id === resLevelId
                    )?.level.toString() ||
                    "Select Rating"
                  }
                  defaultValue={showRec ? recLevelId?.toString() : resLevelId?.toString()}
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
          placeholder={showRec ? "Comments for reconciliation (optional)" : "Comments for rating (required)"}
          value={showRec ? recNotes : resNotes}
          onChange={(e) =>
            showRec ? setRecNotes(e.target.value) : setResNotes(e.target.value)
          }
        />
      </section>
      {(assessmentPartStatus === "Active" || assessmentPartStatus === "Reconciliation") && (
        <section className="mb-8 flex justify-center">
          <Button
            type="submit"
            disabled={
              saving ||
              (assessmentPartStatus === "Active" && (!resLevelId || resNotes === "")) ||
              (assessmentPartStatus === "Reconciliation" && (!recLevelId))
            }
            size="lg"
          >
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save
            {assessmentPartStatus === "Reconciliation" && " Reconciliation"} Response
          </Button>
        </section>
      )}
    </form>
  )
}
