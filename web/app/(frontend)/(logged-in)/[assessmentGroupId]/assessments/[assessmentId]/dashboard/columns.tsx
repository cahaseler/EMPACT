"use client"; // Required for ColumnDef and potentially interactive headers/cells

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge"; // For potential styling

// Define the shape of the data object expected by the columns
export type AssessmentUserDashboardData = {
  id: number;
  prismaUserId: number | null;
  clerkUserId: string | null;
  name: string;
  email: string;
  role: string; // Consider using a specific enum/type if available
  group: string;
  lastCompletedAttributeId: string; // Displaying the ID for now
  lastSignInAt: Date | null;
  signInMethod: string;
};

export const columns: ColumnDef<AssessmentUserDashboardData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
    enableSorting: true,
    // Potential future enhancement: Faceted filter for roles
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    cell: ({ row }) => <div>{row.getValue("group") || "N/A"}</div>, // Handle empty group name
    enableSorting: true,
    // Potential future enhancement: Faceted filter for groups
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    accessorKey: "lastCompletedAttributeId",
    header: "Last Completed", // Simple header for now
    cell: ({ row }) => <div>{row.getValue("lastCompletedAttributeId") || "-"}</div>, // Display ID or dash
  },
  {
    accessorKey: "lastSignInAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Sign In" />
    ),
    cell: ({ row }) => {
      const lastSignInAt = row.getValue("lastSignInAt") as Date | null;
      const clerkUserId = row.original.clerkUserId; // Access original data for clerkUserId check

      if (clerkUserId === null) {
        return <Badge variant="outline">Not Signed Up</Badge>;
      }
      return <div>{lastSignInAt ? lastSignInAt.toLocaleString() : "-"}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "signInMethod",
    header: "Sign In Method",
    cell: ({ row }) => {
       const signInMethod = row.getValue("signInMethod") as string;
       const clerkUserId = row.original.clerkUserId;
       // Display method only if user is signed up
       return <div>{clerkUserId !== null ? signInMethod : "-"}</div>;
    }
  },
];