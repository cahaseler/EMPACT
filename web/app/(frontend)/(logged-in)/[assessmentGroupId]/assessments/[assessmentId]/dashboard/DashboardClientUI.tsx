"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card"; // Add Card imports back
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProgressTable, type AssessmentUserWithDetails } from "./ProgressTable";
import type { PrismaClient as PrismaTypes } from '@/lib/db';

// Define the expected props based on data fetched in page.tsx
interface DashboardClientUIProps {
  // Adjust type to match exactly what's passed from page.tsx's getData
  initialAssessmentUsers: AssessmentUserWithDetails[]; // Use the exported type directly
  initialSortedAttributes: PrismaTypes.AssessmentAttribute[];
  initialUserResponses: PrismaTypes.AssessmentUserResponse[];
}

export function DashboardClientUI({
  initialAssessmentUsers,
  initialSortedAttributes,
  initialUserResponses,
}: DashboardClientUIProps) {

  // --- State for Filters ---
  const [showEnvironment, setShowEnvironment] = useState(true);
  const [showMaturity, setShowMaturity] = useState(true);
  const [showComplete, setShowComplete] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);

  // --- State for Filtered Data ---
  const [filteredAttributes, setFilteredAttributes] = useState(initialSortedAttributes);
  const [filteredUsers, setFilteredUsers] = useState(initialAssessmentUsers); // Use prop directly

  // --- Memoize response map for performance ---
  const responseMap = useMemo(() => {
    const map = new Map<string, boolean>();
    initialUserResponses.forEach((response: PrismaTypes.AssessmentUserResponse) => {
      if (response.userId != null && response.attributeId != null) {
        map.set(`${response.userId}-${response.attributeId}`, true);
      }
    });
    return map;
  }, [initialUserResponses]);

  // --- Effect to filter attributes ---
  useEffect(() => {
    const newFilteredAttributes = initialSortedAttributes.filter((attr: PrismaTypes.AssessmentAttribute) => {
      const hasPeriod = attr.attributeId.includes('.');
      if (!showEnvironment && !hasPeriod) return false;
      if (!showMaturity && hasPeriod) return false;
      return true;
    });
    setFilteredAttributes(newFilteredAttributes);
  }, [showEnvironment, showMaturity, initialSortedAttributes]);

  // --- Effect to filter users ---
  useEffect(() => {
    const visibleAttributeIds = new Set(filteredAttributes.map((attr: PrismaTypes.AssessmentAttribute) => attr.attributeId));

    const newFilteredUsers = initialAssessmentUsers.filter((user: AssessmentUserWithDetails) => {
      if (!user || typeof user.userId !== 'number') {
         console.warn("Skipping user with missing data:", user);
         return true;
      }

      let completedVisibleCount = 0;
      let hasAnyResponseForVisible = false;

      visibleAttributeIds.forEach(attributeId => {
          if (responseMap.has(`${user.userId}-${attributeId}`)) {
              hasAnyResponseForVisible = true;
              completedVisibleCount++;
          }
      });

      const allVisibleCompleted = completedVisibleCount === visibleAttributeIds.size && visibleAttributeIds.size > 0;
      const noneVisibleStarted = !hasAnyResponseForVisible;

      if (!showComplete && allVisibleCompleted) return false;
      if (!showNotStarted && noneVisibleStarted) return false;

      return true;
    });
    setFilteredUsers(newFilteredUsers);
  }, [showComplete, showNotStarted, filteredAttributes, initialAssessmentUsers, responseMap]);


  // --- Render Logic ---
  return (
    // Wrap the Accordion in a Card and CardContent for consistent styling
    <Card>
      <CardContent className="pt-6"> {/* Add padding top like other cards */}
        <Accordion type="single" collapsible className="w-full"> {/* Remove defaultValue */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Progress & Display Options</AccordionTrigger>
            <AccordionContent>
              {/* Container for options and table */}
              <div className="space-y-4">
                {/* --- Filter Controls --- */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-center rounded-md border p-4"> {/* Removed heading */}
                   <div className="flex items-center space-x-2">
                     <Checkbox id="showEnvironment" checked={showEnvironment} onCheckedChange={(checked) => setShowEnvironment(Boolean(checked))} />
                     <Label htmlFor="showEnvironment">Show Environment</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Checkbox id="showMaturity" checked={showMaturity} onCheckedChange={(checked) => setShowMaturity(Boolean(checked))} />
                     <Label htmlFor="showMaturity">Show Maturity</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Checkbox id="showComplete" checked={showComplete} onCheckedChange={(checked) => setShowComplete(Boolean(checked))} />
                     <Label htmlFor="showComplete">Show Complete</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Checkbox id="showNotStarted" checked={showNotStarted} onCheckedChange={(checked) => setShowNotStarted(Boolean(checked))} />
                     <Label htmlFor="showNotStarted">Show Not Started</Label>
                   </div>
                </div>

                {/* --- Progress Table Section (Uses Filtered Data) --- */}
                <ProgressTable
                  assessmentAttributes={filteredAttributes}
                  assessmentUsers={filteredUsers}
                  allAssessmentUserResponses={initialUserResponses}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}