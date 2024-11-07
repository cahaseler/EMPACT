import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function CategoryRatings({
    categoryRatings
}: {
    categoryRatings: any[],
}) {
    return (
        <Table className="border overflow-auto table-fixed w-[95%] mx-auto">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-center border-r">1</TableHead>
                    <TableHead className="text-center border-r">2</TableHead>
                    <TableHead className="text-center border-r">3</TableHead>
                    <TableHead className="text-center border-r">4</TableHead>
                    <TableHead className="text-center">5</TableHead>
                </TableRow>
                <TableRow className="hover:bg-transparent [&_th]:border-r [&_th:last-child]:border-0">
                    {categoryRatings.map((categoryRating, key) => 
                        <TableHead key={key} className="text-center">{categoryRating.rating}</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="hover:bg-transparent [&_td]:border-r [&_td:last-child]:border-0 font-medium">
                    {categoryRatings.map((categoryRating, key) => 
                        <TableCell 
                        key={key}
                        dangerouslySetInnerHTML={{ __html: categoryRating.description }}
                        className="text-description"
                        />
                    )}
                </TableRow>
            </TableBody>
        </Table>
    )
}