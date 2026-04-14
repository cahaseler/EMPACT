"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogPortalContent,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TooltipButton } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

import { AssessmentCollectionUser, User } from "@/prisma/mssql/generated/client"
import { deleteAssessmentCollectionUser } from "../../../../utils/dataActions"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  users,
}: {
  readonly users: (AssessmentCollectionUser & { user: User })[]
}) {
  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">User ID</TableHead>
            <TableHead className="w-48">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: AssessmentCollectionUser & { user: User }) => (
            <TableRow key={user.id}>
              <TableCell>{user.user.id}</TableCell>
              <TableCell>
                {user.user.lastName}, {user.user.firstName}
              </TableCell>
              <TableCell>{user.user.email}</TableCell>
              <TableCell>
                <DeleteModule user={user} numUsers={users.length} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DeleteModule({
  user,
  numUsers,
}: {
  readonly user: AssessmentCollectionUser & { user: User }
  readonly numUsers: number
}) {
  const router = useRouter()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteAssessmentCollectionUser(user.id).then(() => {
      router.refresh()
      toast({
        title: "Collection manager removed successfully.",
      })
    }).catch(error => {
      toast({
        title: `Error removing collection manager: ${error}`
      })
    })
  }

  return numUsers === 1 ? (
    <TooltipButton
      content="In order to remove this collection manager, you must add at least one other manager."
      sizeLarge
    >
      <Button
        size="icon"
        className="cursor-default opacity-50"
      >
        <Trash2 className="w-5 h-5 text-white" />
      </Button>
    </TooltipButton>
  ) : (
    <AlertDialog>
      <TooltipButton content="Remove Collection Manager">
        <AlertDialogTrigger asChild>
          <Button size="icon">
            <Trash2 className="w-5 h-5 text-white" />
          </Button>
        </AlertDialogTrigger>
      </TooltipButton>
      <AlertDialogPortalContent
        title="Remove Collection Manager"
        description="Are you sure you want to remove this collection manager?"
        actionName="Remove"
        action={(e: React.FormEvent) => handleDelete(e)}
      />
    </AlertDialog>
  )
}
