"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
              <TableCell>{user.id}</TableCell>
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
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="cursor-default opacity-50"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-60 text-center">
          In order to remove this collection manager, you must add at least one
          other manager.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon">
                <Trash2 className="w-5 h-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-60 text-center">
              Remove Collection Manager
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <AlertDialogTitle>
              Remove Collection Manager
            </AlertDialogTitle>
            <p>Are you sure you want to remove this collection manager?</p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={(e: React.FormEvent) => handleDelete(e)}>
                  Remove
                </Button>
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}
