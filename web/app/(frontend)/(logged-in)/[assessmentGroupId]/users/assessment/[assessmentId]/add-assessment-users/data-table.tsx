"use client"

import { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { AssessmentUserGroup, User } from "@/prisma/mssql/generated/client"
import { createAssessmentUser } from "../../../../../utils/dataActions"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

type UserWithRoleGroup = {
  userId: number
  role: string
  groupId: number | null
}

export default function DataTable({
  users,
  assessmentId,
  assessmentTypeId,
  groups,
}: Readonly<{
  users: User[]
  assessmentId: number
  assessmentTypeId: number
  groups: AssessmentUserGroup[]
}>) {
  const [usersToAdd, setUsersToAdd] = useState<UserWithRoleGroup[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (usersToAdd.length > 0) {
      setSaving(true)
      try {
        for (let i = 0; i < usersToAdd.length; i++) {
          const userToAdd = usersToAdd[i];
          // Ensure userToAdd and its required properties are defined
          if (userToAdd && userToAdd.role && userToAdd.userId) {
            await createAssessmentUser(
              assessmentId,
              userToAdd.role,
              userToAdd.userId,
              // groupId can be null, so only check userToAdd itself
              userToAdd.groupId
            )
          }
        }
        setSaving(false)
        router.refresh()
        toast({
          title: "User(s) added to assessment successfully.",
        })
      } catch (error) {
        toast({
          title: `Error adding user(s) to assessment: ${error}`,
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Table className="dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Group</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user: User, key: number) => {
              const [isChecked, setIsChecked] = useState<boolean>(false)
              const [role, setRole] = useState<string>("Participant")
              // Initialize groupId safely using optional chaining and nullish coalescing
              const [groupId, setGroupId] = useState<number | null>(
                groups[0]?.id ?? null
              )

              const updateUsersToAdd = () => {
                const newUsersToAdd = usersToAdd.filter(
                  (userWithRole) => userWithRole.userId !== user.id
                )
                setUsersToAdd([
                  ...newUsersToAdd,
                  { userId: user.id, role: role, groupId: groupId },
                ])
              }

              return (
                <TableRow key={key}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUsersToAdd([
                            ...usersToAdd,
                            { userId: user.id, role: role, groupId: groupId },
                          ])
                          setIsChecked(true)
                        } else {
                          setUsersToAdd(
                            usersToAdd.filter(
                              (userWithRole) => userWithRole.userId !== user.id
                            )
                          )
                          setIsChecked(false)
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-center">{user.id}</TableCell>
                  <TableCell>
                    {user.lastName}, {user.firstName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => {
                        setRole(value)
                        if (value !== "Participant") {
                          setGroupId(null)
                        } else {
                          // Set groupId safely using optional chaining and nullish coalescing
                          setGroupId(groups[0]?.id ?? null)
                        }
                        if (isChecked) updateUsersToAdd()
                      }}
                    >
                      <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                        <SelectValue placeholder={role} defaultValue={role} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead Facilitator" key={0}>
                          Lead Facilitator
                        </SelectItem>
                        <SelectItem value="Facilitator" key={1}>
                          Facilitator
                        </SelectItem>
                        <SelectItem value="Participant" key={2}>
                          Participant
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => {
                        setGroupId(parseInt(value, 10))
                        if (isChecked) updateUsersToAdd()
                      }}
                      disabled={role !== "Participant"}
                    >
                      <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                        <SelectValue
                          placeholder={
                            groups.find((group) => group.id === groupId)?.name
                          }
                          defaultValue={groupId?.toString() || undefined}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem
                            value={group.id.toString()}
                            key={group.id}
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No users found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-col items-center">
        <Button type="submit" disabled={saving || usersToAdd.length === 0}>
          {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Add Users
          to Assessment
        </Button>
      </div>
    </form>
  )
}
