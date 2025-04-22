"use client"

import React, { useState } from "react"

import { Part } from "@/prisma/mssql/generated/client"

import type { ColDef } from "ag-grid-community"
import {
  AllCommunityModule,
  ModuleRegistry
} from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { theme } from "@/components/ui/data-table/data-table-theme"

import { AssessmentPartToAdd } from "./add-form"

ModuleRegistry.registerModules([AllCommunityModule]);

export default function PartsTable({
  parts,
  gridRef
}: {
  readonly parts: Part[]
  readonly gridRef: React.RefObject<AgGridReact<AssessmentPartToAdd> | null>
}) {
  const partsToAdd = parts.map((part) => ({
    name: part.name,
    partId: part.id,
    status: "Planned",
    date: new Date(),
  }))

  const [rowData] = React.useState<AssessmentPartToAdd[]>(partsToAdd);

  const [colDefs] = useState<ColDef<AssessmentPartToAdd>[]>([
    { field: "name", suppressHeaderFilterButton: true, resizable: false, sortable: false, flex: 2 },
    {
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellRenderer: selectCellRenderer,
      cellStyle: { padding: 0 },
      cellEditorParams: {
        values: ["Planned", "Active", "Inactive"],
      },
      suppressHeaderFilterButton: true,
      resizable: false,
      sortable: false,
      flex: 2
    },
    {
      field: "date",
      editable: true,
      cellEditor: "agDateCellEditor",
      cellRenderer: dateCellRenderer,
      cellStyle: { padding: 0 },
      suppressHeaderFilterButton: true,
      resizable: false,
      sortable: false,
      flex: 2
    },
  ]);

  return (
    <div>
      <AgGridReact
        ref={gridRef}
        theme={theme}
        rowData={rowData}
        columnDefs={colDefs}
        pagination={false}
        suppressClickEdit={true}
        domLayout="autoHeight"
      />
    </div>
  );
};

function selectCellRenderer(props: CustomCellRendererProps) {
  const handleClick = () => {
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex!,
      colKey: props.column!.getId(),
    });
  };
  return (
    <Select>
      <SelectTrigger
        onClick={handleClick}
        className="h-full w-full focus:ring-offset-indigo-400 focus:ring-transparent rounded-sm border-indigo-200"
      >
        <SelectValue placeholder={props.value} />
      </SelectTrigger>
    </Select>
  );
}

function dateCellRenderer(props: CustomCellRendererProps) {
  const handleClick = () => {
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex!,
      colKey: props.column!.getId(),
    });
  };
  return (
    <Button
      onClick={handleClick}
      variant="dateInput"
      size="offset"
      className="h-full focus:ring-offset-indigo-400 focus:ring-transparent rounded-sm border-indigo-200 text-left"
    >
      <span className="w-full flex flex-row justify-between">
        {props.value ? format(props.value, "MM/dd/yyyy") : ""}
        <CalendarIcon className="mr-2 h-4 w-4" />
      </span>
    </Button>
  );
}