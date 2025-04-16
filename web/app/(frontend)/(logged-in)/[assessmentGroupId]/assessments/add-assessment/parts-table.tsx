"use client"

import { useState, useEffect, useCallback } from "react" // Import useEffect and useCallback

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Part } from "@/prisma/mssql/generated/client"

// Import the shared type definition from the central types file
import type { AssessmentPartToAdd } from "@/types/assessment"

export default function PartsTable({
  parts,
  partsToAdd, // This prop isn't actually used in the refactored version, but kept for type consistency if needed elsewhere
  setPartsToAdd,
}: {
  readonly parts: Part[]
  readonly partsToAdd: AssessmentPartToAdd[] // Uses imported type
  readonly setPartsToAdd: React.Dispatch<React.SetStateAction<AssessmentPartToAdd[]>> // Uses imported type
}) {
  // Initialize the state in the parent component when the table mounts
  // This ensures the parent state reflects the initial default values from PartRow
  useEffect(() => {
    const initialParts = parts.map(part => ({
      partId: part.id,
      status: "Planned", // Default status from PartRow
      date: new Date()    // Default date from PartRow
    }));
    setPartsToAdd(initialParts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts, setPartsToAdd]); // Run only when parts array changes

  // Callback to update the parent state
  const handlePartChange = useCallback((partId: number, status: string, date: Date) => {
    setPartsToAdd(prevParts => {
      const existingPartIndex = prevParts.findIndex(p => p.partId === partId);
      const updatedPart = { partId, status, date };

      if (existingPartIndex > -1) {
        // Update existing part
        const newParts = [...prevParts];
        newParts[existingPartIndex] = updatedPart;
        return newParts;
      } else {
        // This case should ideally not happen if initialized correctly, but handles edge cases
        return [...prevParts, updatedPart];
      }
    });
  }, [setPartsToAdd]);

  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="table-fixed dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part: Part) => (
            <PartRow
              key={part.id}
              part={part}
              initialStatus="Planned" // Default status
              initialDate={new Date()} // Default date
              onPartChange={handlePartChange} // Pass the memoized callback
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// New component for handling each row's state and logic
function PartRow({
  part,
  initialStatus,
  initialDate,
  onPartChange,
}: {
  part: Part
  initialStatus: string
  initialDate: Date
  onPartChange: (partId: number, status: string, date: Date) => void
}) {
  // State is now managed within this component
  const [status, setStatus] = useState<string>(initialStatus)
  const [date, setDate] = useState<Date>(initialDate)

  // Note: The useEffect to initialize parent state was moved to the parent PartsTable component

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onPartChange(part.id, newStatus, date) // Notify parent of the change
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    // Ensure a valid Date is always used. Fallback to current state's date if selectedDate is undefined.
    const newDate = selectedDate || date;
    setDate(newDate)
    onPartChange(part.id, status, newDate) // Notify parent of the change
  }

  return (
    <TableRow>
      <TableCell>{part.name}</TableCell>
      <TableCell>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="dateInput" size="offset">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "MM/dd/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  )
}
