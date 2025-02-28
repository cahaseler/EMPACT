import { 
    Assessment,
    AssessmentPart,
    AssessmentUserResponse,
    Part,
    Section,
    Attribute
} from "@/prisma/mssql/generated/client"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PartRow from "./part-row"
 
export default function PartsTable({ 
    assessmentParts, 
    canEditStatus, 
    numAssessmentUsers, 
    userResponses 
}: {
    readonly assessmentParts: (AssessmentPart & { part: Part & { sections: (Section & { attributes: Attribute[] })[] } })[]
    readonly canEditStatus: boolean
    readonly numAssessmentUsers: number
    readonly userResponses: AssessmentUserResponse[]
}) {
    const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
    return (
        <Table className="table-fixed dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-20">Part ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    {canEditStatus && <TableHead className="w-32">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {assessmentParts.map((assessmentPart: AssessmentPart & { part: Part & { sections: (Section & { attributes: Attribute[] })[] } }) => {
                    const partAttributeIds = assessmentPart.part.sections.flatMap(section => section.attributes.map(attribute => attribute.id))
                    const partResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => partAttributeIds.includes(responseAttributeId))
                    const unfinishedPart = partAttributeIds.length * numAssessmentUsers !== partResponseAttributeIds.length * numAssessmentUsers
                    return (
                        <PartRow 
                            assessmentId={assessmentPart.assessmentId} 
                            assessmentPart={assessmentPart} 
                            canEditStatus={canEditStatus} 
                            unfinishedPart={unfinishedPart}
                        />
                    )
                })}
            </TableBody>
        </Table>
    )
}