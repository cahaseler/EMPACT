"use client"
import { useState } from "react"
import { User } from "@/prisma/mssql/generated/client"
import { createAssessmentCollectionUser } from "../../../../../utils/dataActions"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({ users, collectionId }: Readonly<{
  users: User[],
  collectionId: number
}>) {
  const [usersToAdd, setUsersToAdd] = useState<number[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (usersToAdd.length > 0) {
      setSaving(true)
      try {
        for (var i = 0; i < usersToAdd.length; i++) {
            await createAssessmentCollectionUser(usersToAdd[i], collectionId)
        }
        setSaving(false)
        router.refresh()
        toast({
            title: "Manager(s) added to assessment collection successfully."
        })
      } catch (error) {
        toast({
            title: `Error adding manager(s) to assessment collection: ${error}`
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <Table className="dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-20"/>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? 
                    users.map((user: User, key: number) => {
                        return (
                            <TableRow key={key}>
                                <TableCell>
                                    <Checkbox onCheckedChange={(checked) => {
                                        if (checked) {
                                            setUsersToAdd([...usersToAdd, user.id])
                                        } else {
                                            setUsersToAdd(usersToAdd.filter((userId) => userId !== user.id))
                                        }
                                    }} />
                                </TableCell>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.lastName}, {user.firstName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        )
                    }) : 
                    <TableRow>
                        <TableCell colSpan={4}>
                            No users found
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
        <div className="mt-4 flex flex-col items-center">
            <Button type="submit" disabled={saving || usersToAdd.length === 0}>
                {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Add Managers to Collection
            </Button>
        </div>
    </form>
  )
}