"use client";

import React, { useState } from "react";

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { AssessmentUserGroup, User } from "@/prisma/mssql/generated/client"

import type { ColDef } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  RowSelectionOptions
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { theme } from "@/components/ui/data-table/data-table-theme"

import { toast } from "@/components/ui/use-toast"
import { createAssessmentUser, createAssessmentUsers } from "../../../../../utils/dataActions"

ModuleRegistry.registerModules([AllCommunityModule]);

type UserWithRoleGroup = {
  user: User,
  role: string,
  groupName: string | null
}

export default function DataTable({
  assessmentTypeId,
  assessmentId,
  users,
  groups
}: {
  readonly assessmentTypeId: number
  readonly assessmentId: number
  readonly users: User[],
  readonly groups: AssessmentUserGroup[]
}) {
  const usersWithRoleGroup = users.map((user) => ({
    user,
    role: "Participant",
    groupName: groups?.[0]?.name ?? null, // Safely access name, fallback to null
  }))

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

  const [rowData] = React.useState<UserWithRoleGroup[]>(usersWithRoleGroup);
  const [selectedLength, setSelectedLength] = React.useState<number>(0)
  const [saving, setSaving] = React.useState<boolean>(false)

  const router = useRouter()
  const gridRef = React.useRef<AgGridReact<UserWithRoleGroup>>(null);

  const onSelectionChanged = React.useCallback(() => {
    if (gridRef.current) {
      setSelectedLength(gridRef.current.api.getSelectedRows().length)
    }
  }, [gridRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gridRef.current && gridRef.current.api.getSelectedRows().length > 0) {
      const usersToAdd = gridRef.current.api.getSelectedRows()
      setSaving(true)
      try {
        if (usersToAdd.length === 1) {
          const userToAdd = usersToAdd[0];
          // Add explicit check for userToAdd to satisfy TypeScript
          if (userToAdd) {
            await createAssessmentUser(
              assessmentId,
              userToAdd.role,
              userToAdd.user.id,
              groups.find(group => group.name === userToAdd.groupName)?.id || null
            )
          }
        } else {
          const assessmentUsers = usersToAdd.map(user => ({
            assessmentId,
            role: user.role,
            userId: user.user.id,
            assessmentUserGroupId: groups.find(group => group.name === user.groupName)?.id || null
          }))
          await createAssessmentUsers(assessmentUsers)
        }
        router.push(`/${assessmentTypeId}/users/assessment/${assessmentId}`)
        toast({
          title: "User(s) added to assessment successfully.",
        })
      } catch (error) {
        toast({
          title: `Error adding user(s) to assessment: ${error}`,
        })
      }
    }
  }

  const [colDefs] = useState<ColDef<UserWithRoleGroup>[]>([
    { field: "user.id", headerName: "User ID", resizable: false, width: 80 },
    {
      colId: "name",
      headerName: "Name",
      valueGetter: (params) => `${params.data?.user.lastName}, ${params.data?.user.firstName}`,
      filter: true,
      resizable: false,
      width: 150
    },
    { field: "user.email", headerName: "Email", filter: true, width: 213 },
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
        if (params.newValue === "Participant") params.data.groupName = groups?.[0]?.name ?? null // Safely access name, fallback to null
        else params.data.groupName = null
        return true;
      },
      resizable: false,
      sortable: false
    },
    {
      field: "groupName",
      headerName: "Group",
      editable: (params) => params.data?.role === "Participant",
      cellEditor: "agSelectCellEditor",
      cellRenderer: editableCellRenderer,
      cellStyle: { padding: 0 },
      cellEditorParams: {
        values: groups.map((group) => group.name),
      },
      resizable: false,
      sortable: false
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
          domLayout="autoHeight"
        />
        <div className="mt-4 flex flex-col items-center">
          <Button type="submit" disabled={saving || selectedLength === 0}>
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Add Users
            to Assessment
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
      disabled={
        props.column!.getId() === "groupName" &&
        (props.data?.role === "Lead Facilitator" || props.data?.role === "Facilitator")
      }
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