"use client"

import { useState } from "react"

import { Loader, Save, SquarePen, Trash2, Users, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogPortalContent,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { TooltipButton } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

import {
  Assessment,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentType,
  User
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
        setIsEditing(false)
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
              <TooltipButton content="Edit Assessment Collection">
                <Button onClick={() => setIsEditing(true)} size="icon">
                  <SquarePen className="w-5 h-5 text-white" />
                </Button>
              </TooltipButton>
              {isAdmin && <DeleteModule collection={collection} />}
              {isAdmin && (
                <Link
                  href={`/${assessmentType.id}/users/collection/${collection.id}`}
                >
                  <TooltipButton content="Manage Collection Managers">
                    <Button size="icon">
                      <Users className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipButton>
                </Link>
              )}
            </>
          ) : (
            <>
              <TooltipButton content="Cancel">
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
              </TooltipButton>
              <TooltipButton content="Save Changes to Assessment Collection">
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
              </TooltipButton>
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
    <TooltipButton
      content="In order to delete this assessment collection, you must delete or reassign any associated assessments."
      sizeLarge
    >
      <Button
        variant="default"
        size="icon"
        className="cursor-default opacity-50"
      >
        <Trash2 className="w-5 h-5 text-white" />
      </Button>
    </TooltipButton>
  ) : (
    <AlertDialog>
      <TooltipButton
        content="Delete Assessment Collection"
        sizeLarge
      >
        <AlertDialogTrigger asChild>
          <Button size="icon">
            <Trash2 className="w-5 h-5 text-white" />
          </Button>
        </AlertDialogTrigger>
      </TooltipButton>
      <AlertDialogPortalContent
        title="Delete Assessment Collection"
        description="Are you sure you want to delete this assessment collection?"
        actionName="Delete"
        action={(e: React.FormEvent) => handleDelete(e)}
      />
    </AlertDialog>
  )
}
