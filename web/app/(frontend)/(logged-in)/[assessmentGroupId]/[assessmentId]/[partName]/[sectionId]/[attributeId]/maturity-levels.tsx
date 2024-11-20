import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function MaturityLevels({
    maturityLevels
}: {
    maturityLevels: any[],
}) {
    return (
        <Table className="border border-indigo-100 dark:border-indigo-900 overflow-auto w-[95%] mx-auto">
            <TableHeader>
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className="text-center border-r border-indigo-100 dark:border-indigo-900">Low</TableHead>
                    <TableHead colSpan={3} className="text-center border-r border-indigo-100 dark:border-indigo-900">Medium</TableHead>
                    <TableHead className="text-center">High</TableHead>
                </TableRow>
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className="text-center border-r border-indigo-100 dark:border-indigo-900">1</TableHead>
                    <TableHead className="text-center border-r border-indigo-100 dark:border-indigo-900">2</TableHead>
                    <TableHead className="text-center border-r border-indigo-100 dark:border-indigo-900">3</TableHead>
                    <TableHead className="text-center border-r border-indigo-100 dark:border-indigo-900">4</TableHead>
                    <TableHead className="text-center">5</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent [&_td]:border-r [&_td]:border-indigo-100 [&_td]:dark:border-indigo-900 [&_td:last-child]:border-0 font-medium">
                    <TableCell rowSpan={2}>Not Yet Started</TableCell>
                    {maturityLevels.map((maturityLevel, key) => 
                        <TableCell 
                        key={key}
                        dangerouslySetInnerHTML={{ __html: maturityLevel.description }}
                        className="text-description"
                        />
                    )}
                </TableRow>
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent [&_td]:border-r [&_td]:border-indigo-100 [&_td]:dark:border-indigo-900 [&_td:last-child]:border-0">
                    {maturityLevels.map((maturityLevel, key) => 
                        <TableCell 
                        key={key}
                        dangerouslySetInnerHTML={{ __html: maturityLevel.details }}
                        className="text-description"
                        />
                    )}
                </TableRow>
            </TableBody>
        </Table>
    )
}