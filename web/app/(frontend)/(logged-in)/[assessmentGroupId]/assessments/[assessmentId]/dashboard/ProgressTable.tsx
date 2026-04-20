import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle } from 'lucide-react';
import type { PrismaClient as PrismaTypes } from '@/lib/db';

// Type for user data including nested details, needed by this component
export type AssessmentUserWithDetails = PrismaTypes.AssessmentUser & {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  // Include assessmentUserGroup if needed for display, otherwise omit
  assessmentUserGroup: PrismaTypes.AssessmentUserGroup | null;
};

interface ProgressTableProps {
  assessmentAttributes: PrismaTypes.AssessmentAttribute[]; // Expects potentially filtered attributes
  assessmentUsers: AssessmentUserWithDetails[]; // Expects potentially filtered users
  allAssessmentUserResponses: PrismaTypes.AssessmentUserResponse[]; // Expects ALL responses for lookup
}

export function ProgressTable({
  assessmentAttributes,
  assessmentUsers,
  allAssessmentUserResponses, // Renamed prop for clarity
}: ProgressTableProps) {

  // Create a lookup map from ALL responses passed down
  // Use useMemo here for slight optimization if this component re-renders often,
  // but since filtering happens in parent, it might not be strictly necessary.
  // For simplicity now, create it directly.
  const responseMap = new Map<string, boolean>();
  allAssessmentUserResponses.forEach((response) => {
    if (response.userId != null && response.attributeId != null) {
      responseMap.set(
        `${response.userId}-${response.attributeId}`,
        true
      );
    }
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* User column with increased width and nowrap */}
            <TableHead className="w-[350px] whitespace-nowrap">User</TableHead>
            {/* Map over the potentially filtered attributes */}
            {assessmentAttributes.map((attribute) => (
              <TableHead key={attribute.id} className="text-center py-2"> {/* Compact header */}
                {attribute.attributeId}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Handle case where filtered users might be empty */}
          {assessmentUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={assessmentAttributes.length + 1}
                className="h-24 text-center"
              >
                No users match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            /* Map over the potentially filtered users */
            assessmentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="py-2 font-medium whitespace-nowrap"> {/* Compact cell */}
                  {user.user
                    ? `${user.user.firstName ?? ''} ${user.user.lastName ?? ''}`.trim() || user.user.email || `User ID: ${user.userId}`
                    : `User ID: ${user.userId}`
                  }
                </TableCell>
                {/* Map over the potentially filtered attributes again for cells */}
                {assessmentAttributes.map((attribute) => {
                  // Check the response map using the user's actual userId
                  const hasResponse = responseMap.get(
                    `${user.userId}-${attribute.attributeId}`
                  );
                  return (
                    <TableCell key={`${user.id}-${attribute.id}`} className="py-2 text-center"> {/* Compact cell */}
                      {hasResponse ? (
                        <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}