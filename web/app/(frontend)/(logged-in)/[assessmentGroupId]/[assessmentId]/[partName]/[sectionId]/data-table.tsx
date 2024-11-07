"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export function DataTable({
    attributes, 
    url
}: {
    attributes: any[], 
    url: string
}) {
    const router = useRouter()

    return (
        <Table className="dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="cursor-pointer">
                {attributes.map((attribute, key) => (
                <TableRow key={key} onClick={() =>
                    router.push(url + `/${attribute.id}`)
                }>
                    <TableCell>{attribute.name}</TableCell>
                    <TableCell>{attribute.rating}</TableCell>
                    <TableCell>{attribute.comments}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}