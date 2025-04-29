"use client"

import { useState } from "react"

import { Loader, Save, SquarePen, Trash2, Users, X } from "lucide-react"
import Link from "next/link"
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
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

import {
  Assessment,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentType,
  User,
} from "@/prisma/mssql/generated/client"
import {
  deleteAssessmentCollection,
  updateAssessmentCollection,
} from "../../../utils/dataActions"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  collection,
  assessmentType,
  isAdmin,
}: {
  readonly collection: AssessmentCollection & {
    assessments: Assessment[]
    assessmentCollectionUser: (AssessmentCollectionUser & { user: User })[]
  }
  readonly assessmentType: AssessmentType
  readonly isAdmin: boolean
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(collection.name)
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    if (name !== "") {
      e.preventDefault()
      setSaving(true)
      await updateAssessmentCollection(
        collection.id,
        name,
        assessmentType.id
      ).then(() => {
        setSaving(false)
        router.refresh()
        toast({
          title: "Assessment collection updated successfully.",
        })
      }).catch(error => {
        setSaving(false)
        toast({
          title: `Error updating assessment collection: ${error}`
        })
      })
    }
  }

  return (
    <TableRow key={collection.id}>
      <TableCell>{collection.id}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          collection.name
        )}
      </TableCell>
      <TableCell>
        <ul className="list-none">
          {collection.assessments.map((assessment) => (
            <li key={assessment.id}>{assessment.name}</li>
          ))}
        </ul>
      </TableCell>
      <TableCell>
        <ul className="list-none">
          {collection.assessmentCollectionUser.map((user) => (
            <li key={user.id}>
              {user.user.lastName}, {user.user.firstName}
            </li>
          ))}
        </ul>
      </TableCell>
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
                    Edit Assessment Collection
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isAdmin && <DeleteModule collection={collection} />}
              {isAdmin && (
                <Link
                  href={`/${assessmentType.id}/users/collection/${collection.id}`}
                >
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon">
                          <Users className="w-5 h-5 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-center">
                        Manage Collection Managers
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              )}
            </>
          ) : (
            <>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setName(collection.name)
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
                    Save Changes to Assessment Collection
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
  collection,
}: {
  readonly collection: AssessmentCollection & { assessments: Assessment[] }
}) {
  const router = useRouter()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteAssessmentCollection(collection.id)
    router.refresh()
    toast({
      title: "Assessment collection deleted successfully.",
    })
  }

  return collection.assessments.length > 0 ? (
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
          In order to delete this assessment collection, you must delete or
          reassign any associated assessments.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AlertDialog>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button size="icon">
                <Trash2 className="w-5 h-5 text-white" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="w-60 text-center">
            Delete Assessment Collection
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <div className="flex flex-col space-y-6 text center">
            <p>Are you sure you want to delete this assessment collection?</p>
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
