"use client"

import { useState } from "react"

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
import {
  Assessment,
  AssessmentPart,
  AssessmentUserResponse,
  Attribute,
  Part,
  Section,
} from "@/prisma/mssql/generated/client"

type AssessmentPartToAdd = {
  partId: number
  status: string
  date: Date
}

export default function PartsTable({
  parts,
  partsToAdd,
  setPartsToAdd,
}: {
  readonly parts: Part[]
  readonly partsToAdd: AssessmentPartToAdd[]
  readonly setPartsToAdd: Function
}) {
  return (
    <Table className="table-fixed dark:bg-transparent">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parts.map((part: Part) => {
          const [status, setStatus] = useState<string>("Planned")
          const [date, setDate] = useState<Date | undefined>(new Date())

          const updatePartsToAdd = () => {
            const newPartsToAdd = partsToAdd.filter(
              (partToAdd) => partToAdd.partId !== part.id
            )
            setPartsToAdd([
              ...newPartsToAdd,
              { partId: part.id, status: status, date: date },
            ])
          }

          return (
            <TableRow key={part.id}>
              <TableCell>{part.name}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => {
                    setStatus(value)
                    updatePartsToAdd()
                  }}
                >
                  <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                    <SelectValue placeholder={status} defaultValue={status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned" key={0}>
                      Planned
                    </SelectItem>
                    <SelectItem value="Active" key={1}>
                      Active
                    </SelectItem>
                    <SelectItem value="Inactive" key={2}>
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="dateInput" size="offset">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "MM/dd/yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        if (selectedDate !== undefined) {
                          setDate(selectedDate)
                          updatePartsToAdd()
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
