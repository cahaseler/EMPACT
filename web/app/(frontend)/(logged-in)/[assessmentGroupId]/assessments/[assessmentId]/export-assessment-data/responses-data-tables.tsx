"use client"

import React, { useMemo, useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Assessment,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  Section,
  User
} from "@/prisma/mssql/generated/client"
import { sortAttributes } from "../../../../utils/dataCalculations"
import { exportResponses } from "./export"

import type { ColDef } from "ag-grid-community"
import {
  AllCommunityModule,
  ModuleRegistry
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"

import { Button } from "@/components/ui/button"
import { theme } from "@/components/ui/data-table/data-table-theme"

import { toast } from "@/components/ui/use-toast"

ModuleRegistry.registerModules([AllCommunityModule]);

type AssessmentUserResponseData = AssessmentUserResponse & {
  user: User,
  assessmentUserGroup: AssessmentUserGroup | null,
  level: Level
}

export default function ResponsesDataTables({
  assessment,
  responses
}: {
  readonly assessment: Assessment & {
    assessmentParts: (AssessmentPart & {
      part: Part
    })[],
    assessmentAttributes: (AssessmentAttribute & {
      attribute: Attribute & {
        levels: Level[],
        section: Section & {
          part: Part & {
            assessmentPart: AssessmentPart[]
          }
        }
      }
    })[]
  }
  readonly responses: AssessmentUserResponseData[]
}) {

  const router = useRouter()

  const paginationPageSizeSelector = React.useMemo<number[] | boolean>(() => {
    return [10, 20, 30, 40, 50];
  }, []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      resizable: false
    };
  }, []);

  return (
    <div>
      {assessment.assessmentParts.map((assessmentPart: AssessmentPart & { part: Part }) => {

        const attributeIds = sortAttributes(
          assessment.assessmentAttributes.filter(
            (attribute) => {
              return attribute.attribute.section.partId === assessmentPart.part.id
            }
          ).map(
            (attribute) => attribute.attribute
          )
        ).map(
          (attribute) => attribute.id
        )

        const responsesInPart = responses.filter((responses => {
          return attributeIds.includes(responses.attributeId)
        }))

        const [exporting, setExporting] = useState<boolean>(false)
        const handleExport = () => {
          setExporting(true)
          exportResponses({
            assessment,
            assessmentPart,
            attributeIds,
            responses: responsesInPart
          }).then(() => {
            router.refresh()
            toast({
              title: `${assessmentPart.part.name} responses exported successfully.`
            })
            setExporting(false)
          }).catch(error => {
            router.refresh()
            toast({
              title: `Error exporting ${assessmentPart.part.name} responses: ${error}`
            })
            setExporting(false)
          })
        }

        const [rowData] = useState<AssessmentUserResponseData[]>(responsesInPart);

        const [colDefs] = useState<ColDef<AssessmentUserResponseData>[]>([
          {
            colId: "attributeId",
            headerName: assessmentPart.part.attributeType,
            width: 120,
            valueGetter: (params) => {
              return assessmentPart.part.attributeType === "Attribute" ?
                params.data?.attributeId.toUpperCase() :
                params.data?.attributeId
            }
          },
          {
            field: "assessmentUserGroup.name",
            headerName: "Group"
          },
          {
            field: "user.id",
            headerName: "User ID",
            width: 100,
            filter: false
          },
          {
            colId: "name",
            headerName: "Name",
            valueGetter: (params) => `${params.data?.user.lastName}, ${params.data?.user.firstName}`
          },
          {
            field: "level.level",
            headerName: "Rating",
            width: 100,
            filter: false
          },
          {
            field: "notes",
            headerName: "Comments",
            width: 1000,
            filter: false,
            sortable: false
          }
        ]);

        return (
          <div key={assessmentPart.id} className="mb-4">
            <div className="mb-2">
              <h2 className="text-2xl font-bold tracking-tighter">
                {assessmentPart.part.name} Responses
              </h2>
            </div>
            <AgGridReact
              theme={theme}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              alwaysMultiSort={true}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={paginationPageSizeSelector}
              domLayout="autoHeight"
            />
            <div className="mt-4 flex flex-col items-center">
              <Button onClick={handleExport} disabled={exporting}>
                {exporting && <Loader className="mr-2 h-4 w-4 animate-spin" />} Export {assessmentPart.part.name} Responses
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  );
};