"use client"

import { useState } from "react"

import { Loader, Save, SquarePen, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
  AssessmentUser,
  AssessmentUserGroup,
  User,
} from "@/prisma/mssql/generated/client"
import {
  deleteAssessmentUserGroup,
  updateAssessmentUserGroup,
} from "../../../../../utils/dataActions"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  group,
}: {
  readonly group: AssessmentUserGroup & {
    assessmentUser: (AssessmentUser & { user: User })[]
  }
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(group.name)
  const [status, setStatus] = useState<string>(group.status)
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    if (name !== "") {
      e.preventDefault()
      setSaving(true)
      await updateAssessmentUserGroup(group.id, name, status).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: "Assessment user group updated successfully.",
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error updating assessment user group: ${error}`
        })
      })
    }
  }

  return (
    <TableRow key={group.id}>
      <TableCell>{group.id}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          group.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
              <SelectValue placeholder={status} defaultValue={status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active" key={0}>
                Active
              </SelectItem>
              <SelectItem value="Inactive" key={1}>
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          group.status
        )}
      </TableCell>
      <TableCell>{group.assessmentUser.length}</TableCell>
      <TableCell>
        <div className="grid grid-cols-2 gap-2 w-20">
          {!isEditing ? (
            <>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => setIsEditing(true)} size="icon">
                      <SquarePen className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    Edit Assessment User Group
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DeleteModule group={group} />
            </>
          ) : (
            <>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setName(group.name)
                        setStatus(group.status)
                      }}
                      variant="outline"
                      size="icon"
                      className="border-[3px]"
                    >
                      <X className="w-5 h-5 stroke-[3px]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    Cancel
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={(e: React.FormEvent) => handleUpdate(e)}
                      size="icon"
                    >
                      {saving ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    Save Changes
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

function DeleteModule({
  group,
}: {
  readonly group: AssessmentUserGroup & { assessmentUser: AssessmentUser[] }
}) {
  const router = useRouter()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteAssessmentUserGroup(group.id)
    router.refresh()
    toast({
      title: "User group deleted successfully.",
    })
  }

  return group.assessmentUser.length > 0 ? (
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
          In order to delete this user group, you must delete or reassign any
          associated assessment users.
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
              Delete Assessment User Group
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <p>Are you sure you want to delete this user group?</p>
            <div className="flex flex-row space-x-2 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={(e: React.FormEvent) => handleDelete(e)}>
                  Delete
                </Button>
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}
