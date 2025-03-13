"use client"
import { User, AssessmentCollectionUser } from "@/prisma/mssql/generated/client"
import { deleteAssessmentCollectionUser } from "../../../../utils/dataActions"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table"
import { 
    TooltipProvider, 
    Tooltip, 
    TooltipTrigger, 
    TooltipContent 
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    users
}: {
    readonly users: (AssessmentCollectionUser & { user: User })[]
}) {
    return (
        <Table className="table-fixed dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-32">User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user: AssessmentCollectionUser & { user: User }) => 
                    <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.user.lastName}, {user.user.firstName}</TableCell>
                        <TableCell>{user.user.email}</TableCell>
                        <TableCell>
                            <DeleteModule user={user} numUsers={users.length} />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

function DeleteModule({ user, numUsers } : { 
    user: AssessmentCollectionUser & { user: User } 
    numUsers: number
}) {
    const router = useRouter()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        await deleteAssessmentCollectionUser(user.id)
        router.refresh()
        toast({
            title: "Collection manager removed successfully."
        })
    }

    return (
        numUsers === 1 ? 
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="default" size="icon" className="cursor-default opacity-50">
                            <Trash2 className="w-5 h-5 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 text-center">
                        In order to remove this collection manager, you must add at least one other manager.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        : 
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="icon">
                        <Trash2 className="w-5 h-5 text-white" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <div className="flex flex-col space-y-6 text center">
                            <p>Are you sure you want to remove this collection manager?</p>
                            <div className="flex flex-row space-x-2 justify-end">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
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