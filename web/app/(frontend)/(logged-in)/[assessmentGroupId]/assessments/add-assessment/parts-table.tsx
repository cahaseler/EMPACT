"use client"

import { useState, useEffect } from "react" // Import useEffect

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

type AssessmentPartToAdd = {
  partId: number
  status: string
  date: Date | undefined
}

export default function PartsTable({
  parts,
  partsToAdd,
  setPartsToAdd,
}: {
  readonly parts: Part[]
  readonly partsToAdd: AssessmentPartToAdd[]
  readonly setPartsToAdd: React.Dispatch<React.SetStateAction<AssessmentPartToAdd[]>>
}) {
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
              onPartChange={(partId, status, date) => {
                // Update the partsToAdd state in the parent component
                setPartsToAdd(prevParts => {
                  const existingPartIndex = prevParts.findIndex(p => p.partId === partId);
                  const updatedPart = { partId, status, date };

                  if (existingPartIndex > -1) {
                    // Update existing part
                    const newParts = [...prevParts];
                    newParts[existingPartIndex] = updatedPart;
                    return newParts;
                  } else {
                    // Add new part (shouldn't happen if initialized correctly, but safe)
                    return [...prevParts, updatedPart];
                  }
                });
              }}
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

  // Effect to initialize the parent state when the component mounts or props change
  useEffect(() => {
    onPartChange(part.id, initialStatus, initialDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part.id, initialStatus, initialDate, onPartChange]); // Add dependencies
  // Handler functions MUST be inside the component function scope
  // Handler functions MUST be inside the component function scope

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onPartChange(part.id, newStatus, date) // Notify parent of the change
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    const newDate = selectedDate || new Date(); // Fallback to current date if undefined
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
