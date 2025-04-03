"use client"

import { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { AssessmentCollection, User } from "@/prisma/mssql/generated/client"
import {
  createAssessmentCollection,
  createAssessmentCollectionUser,
} from "../../../utils/dataActions"
import { isAdmin, isCollectionManager } from "../../../utils/permissions"

export default function AddCollection({
  assessmentTypeId,
  users,
  session,
}: {
  readonly assessmentTypeId: number
  readonly users: User[]
  readonly session: Session | null
}) {
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  // Initialize managerId safely using optional chaining and nullish coalescing
  const [managerId, setManagerId] = useState<string>(users[0]?.id?.toString() ?? "")
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    if (session) {
      e.preventDefault()
      setSaving(true)
      await createAssessmentCollection(name, assessmentTypeId).then(
        async (collection: AssessmentCollection) => {
          if (isCollectionManager(session)) {
            await createAssessmentCollectionUser(
              parseInt(session.user.id, 10),
              collection.id
            ).then(() => {
              setName("")
              setSaving(false)
              router.refresh()
              toast({
                title: "Assessment collection added successfully.",
              })
            }).catch(error => {
              setSaving(false)
              toast({
                title: `Error adding assessment collection: ${error}`
              })
            })
          } else {
            await createAssessmentCollectionUser(
              parseInt(managerId, 10),
              collection.id
            ).then(() => {
              setName("")
              setSaving(false)
              router.refresh()
              toast({
                title: "Assessment collection added successfully.",
              })
            }).catch(error => {
              setSaving(false)
              toast({
                title: `Error adding assessment collection: ${error}`
              })
            })
          }
        }
      )
    }
  }

  return (
    <div className="flex flex-col space-y-4 items-end">
      {!isAdding ? (
        <Button
          onClick={() => setIsAdding(true)}
          variant="default"
          size="default"
        >
          Add Assessment Collection
        </Button>
      ) : (
        <Button
          onClick={() => setIsAdding(false)}
          variant="outline"
          size="default"
        >
          Cancel
        </Button>
      )}
      {isAdding && (
        <form onSubmit={handleSubmit}>
          <section className="w-full">
            <div className="flex flex-row space-x-2 justify-end">
              <div className="flex flex-col space-y-2">
                <Input
                  type="text"
                  placeholder="Collection Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Label>Name</Label>
              </div>
              {isAdmin(session) && (
                <div className="min-w-40 flex flex-col space-y-2">
                  <Select onValueChange={(value) => setManagerId(value)}>
                    <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                      <SelectValue
                        placeholder={users[0] ? `${users[0]?.lastName ?? ''}, ${users[0]?.firstName ?? ''}` : "Select Manager"}
                        defaultValue={managerId}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: User, key: number) => (
                        <SelectItem value={user.id.toString()} key={key}>
                          {user.lastName}, {user.firstName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label>Manager</Label>
                </div>
              )}
              <Button
                type="submit"
                disabled={saving || name === "" || managerId === null}
              >
                {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Add
              </Button>
            </div>
          </section>
        </form>
      )}
    </div>
  )
}
