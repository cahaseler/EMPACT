"use client"

import React, { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  Permission,
  User
} from "@/prisma/mssql/generated/client"

import type { ColDef } from "ag-grid-community"
import {
  AllCommunityModule,
  ModuleRegistry,
  RowSelectionOptions
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { theme } from "@/components/ui/data-table/data-table-theme"

import { toast } from "@/components/ui/use-toast"
import {
  updateAssessmentUser,
  updateAssessmentUsers,
  updateAssessmentUserResponsesGroupId
} from "../../../../../utils/dataActions"

ModuleRegistry.registerModules([AllCommunityModule]);

type AssessmentUserWithInfo = AssessmentUser & {
  user: User,
  participantParts: AssessmentPart[],
  permissions: Permission[]
}

export default function DataTable({
  assessmentTypeId,
  assessmentId,
  assessmentUsers,
  groups,
  somePartFinalized
}: {
  readonly assessmentTypeId: number
  readonly assessmentId: number
  readonly assessmentUsers: AssessmentUserWithInfo[],
  readonly groups: AssessmentUserGroup[]
  readonly somePartFinalized: boolean
}) {
  const rowSelection = React.useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const paginationPageSizeSelector = React.useMemo<number[] | boolean>(() => {
    return [10, 20, 30, 40, 50];
  }, []);

  const [rowData] = React.useState<AssessmentUserWithInfo[]>(assessmentUsers);
  const [selectedLength, setSelectedLength] = React.useState<number>(0)
  const [saving, setSaving] = React.useState<boolean>(false)

  const router = useRouter()
  const gridRef = React.useRef<AgGridReact<AssessmentUserWithInfo>>(null);

  const onSelectionChanged = React.useCallback(() => {
    if (gridRef.current) {
      setSelectedLength(gridRef.current.api.getSelectedRows().length)
    }
  }, [gridRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gridRef.current && gridRef.current.api.getSelectedRows().length > 0) {
      const usersToUpdate = gridRef.current.api.getSelectedRows()
      setSaving(true)
      try {
        if (usersToUpdate.length === 1) {
          const userToUpdate = usersToUpdate[0];
          // Add explicit check for userToUpdate to satisfy TypeScript
          if (userToUpdate) {
            await updateAssessmentUser(
              userToUpdate.id,
              userToUpdate.role,
              userToUpdate.assessmentUserGroupId,
              userToUpdate.participantParts,
              userToUpdate.permissions
            )
            await updateAssessmentUserResponsesGroupId(
              userToUpdate.assessmentId,
              userToUpdate.userId,
              userToUpdate.assessmentUserGroupId || groups[0]?.id || 0
            )
          }
        } else {
          await updateAssessmentUsers(usersToUpdate)
          usersToUpdate.forEach(async (user) => {
            await updateAssessmentUserResponsesGroupId(
              user.assessmentId,
              user.userId,
              user.assessmentUserGroupId || groups[0]?.id || 0
            )
          })
        }
        router.push(`/${assessmentTypeId}/users/assessment/${assessmentId}`)
        toast({
          title: "Assessment user(s) updated successfully.",
        })
      } catch (error) {
        toast({
          title: `Error updating assessment user(s): ${error}`,
        })
      }
    }
  }

  const [colDefs] = useState<ColDef<AssessmentUserWithInfo>[]>([
    { field: "user.id", headerName: "User ID", resizable: false, flex: 1 },
    {
      colId: "name",
      headerName: "Name",
      valueGetter: (params) => `${params.data?.user.lastName}, ${params.data?.user.firstName}`,
      filter: true,
      resizable: false,
      flex: 2
    },
    { field: "user.email", headerName: "Email", filter: true, flex: 3 },
    {
      field: "role",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellRenderer: editableCellRenderer,
      cellStyle: { padding: 0 },
      cellEditorParams: {
        values: ["Participant", "Facilitator", "Lead Facilitator"],
      },
      valueSetter: params => {
        params.data.role = params.newValue;
        if (params.newValue === "Participant") params.data.assessmentUserGroupId = groups?.[0]?.id ?? null // Safely access name, fallback to null
        else params.data.assessmentUserGroupId = null
        return true;
      },
      resizable: false,
      sortable: false,
      flex: 2
    },
    {
      colId: "groupName",
      headerName: "Group",
      valueGetter: (params) => params.data?.assessmentUserGroupId ?
        groups.find((group) => group.id === params.data?.assessmentUserGroupId)?.name :
        null,
      tooltipValueGetter: () => somePartFinalized && "The assessment this user is assigned to has one or more finalized parts. In order to change this user's group, you must un-finalize the part(s) and re-submit for scoring after the user's group has been changed.",
      editable: (params) => !somePartFinalized && params.data?.role === "Participant",
      cellEditor: "agSelectCellEditor",
      cellRenderer: editableCellRenderer,
      cellStyle: { padding: 0 },
      cellEditorParams: {
        values: groups.map((group) => group.name),
      },
      valueSetter: params => {
        params.data.assessmentUserGroupId = groups.find((group) => group.name === params.newValue)?.id ?? null
        return true;
      },
      resizable: false,
      sortable: false,
      flex: 2
    },
  ]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <AgGridReact
          ref={gridRef}
          theme={theme}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={paginationPageSizeSelector}
          suppressClickEdit={true}
          tooltipShowDelay={100}
          domLayout="autoHeight"
        />
        <div className="mt-4 flex flex-col items-center">
          <Button type="submit" disabled={saving || selectedLength === 0}>
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Save Changes
            to Selected Assessment Users
          </Button>
        </div>
      </form>
    </div>
  );
};

function editableCellRenderer(props: CustomCellRendererProps) {
  const handleClick = () => {
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex!,
      colKey: props.column!.getId(),
    });
  };
  return (
    <Select
      disabled={props.colDef?.editable !== true}
    >
      <SelectTrigger
        onClick={handleClick}
        className="h-full w-full focus:ring-offset-indigo-400 focus:ring-transparent rounded-sm border-indigo-200"
      >
        <SelectValue placeholder={props.value} />
      </SelectTrigger>
    </Select>
  );
}