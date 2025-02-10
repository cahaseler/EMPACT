"use client"

import { useState } from "react"
import { createAssessmentUserResponse, updateAssessmentUserResponse } from "../../../../../../utils/dataActions"

import { Assessment, Level, AssessmentUserResponse } from "@/prisma/mssql/generated/client"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

export default function AttributeUserResponse({
    assessment,
    userId,
    attributeId, 
    levels, 
    userResponse
}: {
    assessment: Assessment,
    userId: string | undefined,
    attributeId: string,
    levels: Level[],
    userResponse: AssessmentUserResponse
}) {
    const userResponseLevel = levels.find((level: Level) => level.id === userResponse?.levelId)
    const [levelId, setLevelId] = useState<number | undefined>(userResponseLevel ? userResponseLevel.id : undefined)
    const [notes, setNotes] = useState<string>(userResponse ? userResponse.notes : "")
    const [saving, setSaving] = useState<boolean>(false)
    const [levelError, setLevelError] = useState<string>("")
    const [notesError, setNotesError] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (userId) {
            if (levelId) {
              setLevelError("")
              const responseLevel = levels.find((level: Level) => level.id === levelId)
              if (responseLevel && responseLevel.level < 4 && !notes) { 
                setNotesError("Please enter comments for a rating below 4.")
              }
              else {
                setSaving(true)
                setLevelError("")
                setNotesError("")
                if (userResponse) {
                    await updateAssessmentUserResponse({ ...userResponse, levelId: levelId, notes }).then(() => setSaving(false))
                } else {
                    await createAssessmentUserResponse(assessment.id, parseInt(userId, 10), attributeId, levelId, notes).then(
                      () => {
                        setSaving(false)
                        location.reload()
                      })
                }
              }
            } else {
                setLevelError("Please select a rating.")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <section className="mb-8 flex flex-col space-y-4 justify-center">
                  <h2 className="text-2xl font-bold max-lg:ml-2">Rating</h2>
                  <div className="w-1/3 sm:w-1/4 lg:w-1/6">
                    <Select onValueChange={(value) => {
                        setLevelId(parseInt(value, 10))
                    }}>
                      <SelectTrigger className="h-fit min-h-[32px] focus:ring-offset-indigo-400 focus:ring-transparent">
                        <SelectValue 
                          placeholder={userResponseLevel ? userResponseLevel.level.toString() : "Select Rating"} 
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
                  {levelError && <p className="text-red-500">{levelError}</p>}
                </section>
                <section className="mb-8 flex flex-col space-y-4 justify-center">
                  <h2 className="text-2xl font-bold max-lg:ml-2">Comments</h2>
                  {/* TODO: Convert to WYSIWYG */}
                  <Textarea 
                    className="h-40 border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40 resize-none" 
                    placeholder="Notes for rating (optional for rating 4 and 5)"
                    defaultValue={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  {notesError && <p className="text-red-500">{notesError}</p>}
                </section>
                {assessment.status === "Active" && <section className="mb-8 flex justify-center">
                  <Button type="submit" disabled={saving} className="w-fit rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-6 text-md font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Save Response
                  </Button>
                </section>}
        </form>
    )
  }