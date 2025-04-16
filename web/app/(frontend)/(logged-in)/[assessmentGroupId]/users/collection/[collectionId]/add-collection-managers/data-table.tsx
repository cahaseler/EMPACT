"use client"

import React, { useState } from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "@/prisma/mssql/generated/client"

import type { ColDef } from "ag-grid-community"
import {
  AllCommunityModule,
  ModuleRegistry,
  RowSelectionOptions
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react"

import { Button } from "@/components/ui/button"
import { theme } from "@/components/ui/data-table/data-table-theme"

import { toast } from "@/components/ui/use-toast"
import { createAssessmentCollectionUser, createAssessmentCollectionUsers } from "../../../../../utils/dataActions"

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DataTable({
  assessmentTypeId,
  assessmentCollectionId,
  users
}: {
  assessmentTypeId: number
  assessmentCollectionId: number
  users: User[]
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

  const [rowData] = React.useState<User[]>(users);
  const [selectedLength, setSelectedLength] = React.useState<number>(0)
  const [saving, setSaving] = React.useState<boolean>(false)

  const router = useRouter()
  const gridRef = React.useRef<AgGridReact<User>>(null);

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
          await createAssessmentCollectionUser(
            usersToAdd[0].id,
            assessmentCollectionId
          )
        } else {
          const assessmentUsers = usersToAdd.map(user => ({
            userId: user.id,
            role: "Collection Manager",
            assessmentCollectionId
          }))
          await createAssessmentCollectionUsers(assessmentUsers)
        }
        router.push(`/${assessmentTypeId}/users/collection/${assessmentCollectionId}`)
        toast({
          title: "Manager(s) added to assessment collection successfully.",
        })
      } catch (error) {
        toast({
          title: `Error adding manager(s) to assessment collection: ${error}`,
        })
      }
    }
  }

  const [colDefs] = useState<ColDef<User>[]>([
    { field: "id", headerName: "User ID", resizable: false, flex: 1 },
    {
      colId: "name",
      headerName: "Name",
      valueGetter: (params) => `${params.data?.lastName}, ${params.data?.firstName}`,
      filter: true,
      resizable: false,
      flex: 2
    },
    { field: "email", headerName: "Email", filter: true, resizable: false, flex: 3 }
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
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />} Add Managers
            to Collection
          </Button>
        </div>
      </form>
    </div>
  );
};