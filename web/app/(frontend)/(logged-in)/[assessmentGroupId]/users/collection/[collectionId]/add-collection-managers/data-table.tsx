"use client"

import React, { useState, useCallback, useMemo, useRef } from "react" // Consolidate imports

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "@/prisma/mssql/generated/client"

import type { ColDef } from "ag-grid-community"
import {
  AllCommunityModule,
  ModuleRegistry
  // RowSelectionOptions // Type not needed directly for state if just storing string
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
  // Store the selection mode directly as a string
  const rowSelectionMode = "multiple";

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [10, 20, 30, 40, 50];
  }, []);

  const [rowData] = useState<User[]>(users);
  const [selectedLength, setSelectedLength] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)

  const router = useRouter()
  const gridRef = useRef<AgGridReact<User>>(null);

  const onSelectionChanged = useCallback(() => {
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
          // Add check to satisfy TypeScript
          const user = usersToAdd[0];
          if (user) {
            await createAssessmentCollectionUser(
              user.id, // Pass user ID
              assessmentCollectionId // Use correct prop name
            )
          } else {
             throw new Error("Selected user is undefined."); // Should not happen
          }
        } else {
          const assessmentUsers = usersToAdd.map(user => {
             if (!user) throw new Error("Undefined user found in selection."); // Add check in map
             return {
                userId: user.id, // Pass user ID
                role: "Collection Manager",
                assessmentCollectionId // Use correct prop name
             }
          });
          await createAssessmentCollectionUsers(assessmentUsers)
        }
        router.push(`/${assessmentTypeId}/users/collection/${assessmentCollectionId}`)
        toast({
          title: "Manager(s) added to assessment collection successfully.",
        })
      } catch (error) {
        console.error("Error adding managers:", error); // Log the error for debugging
        toast({
          title: "Error adding manager(s)",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive"
        })
      } finally {
        setSaving(false)
      }
    } else {
      toast({
        title: "No users selected",
        description: "Please select at least one user to add as a manager.",
      })
    }
  }

  const [colDefs] = useState<ColDef<User>[]>([
    // Add checkbox selection to the ID column
    {
        field: "id",
        headerName: "User ID",
        resizable: false,
        flex: 1,
        checkboxSelection: true, // Enable checkbox selection for this column
        headerCheckboxSelection: true // Enable header checkbox for select/deselect all
    },
    {
      colId: "name",
      headerName: "Name",
      valueGetter: (params) => params.data ? `${params.data.lastName}, ${params.data.firstName}` : '', // Add null check for params.data
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
          rowSelection={rowSelectionMode} // Pass the mode string directly
          onSelectionChanged={onSelectionChanged}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={paginationPageSizeSelector}
          suppressRowClickSelection={true} // Keep row click selection disabled when using checkboxes
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