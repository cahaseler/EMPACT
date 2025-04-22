"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Assessment,
  AssessmentCollection,
  AssessmentType,
} from "@/prisma/mssql/generated/client"
import AssessmentsTable from "./assessments-table"
import CollectionsTable from "./collections-table"

export default function PageView({
  assessments,
  collections,
  assessmentType,
  isAdmin,
}: Readonly<{
  assessments: Assessment[]
  collections: (AssessmentCollection & { assessments: Assessment[] })[]
  assessmentType: AssessmentType
  isAdmin: boolean
}>) {
  const [assessmentsOrCollections, setAssessmentsOrCollections] = useState<
    "assessments" | "collections"
  >("assessments")
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-4 max-lg:ml-2">
          <div className="flex flex-col max-md:space-y-2 md:flex-row md:space-x-4 justify-between">
            <h1 className="text-3xl font-bold tracking-tighter">
              {assessmentType.name} Assessment {assessmentsOrCollections === "collections" ? "Collection Managers" : "Users"}
            </h1>
            {isAdmin && (
              <div className="flex flex-row">
                <Button
                  className="rounded-r-none"
                  onClick={() => setAssessmentsOrCollections("assessments")}
                  disabled={assessmentsOrCollections === "assessments"}
                >
                  Assessments
                </Button>
                <Button
                  className="rounded-l-none"
                  onClick={() => setAssessmentsOrCollections("collections")}
                  disabled={assessmentsOrCollections === "collections"}
                >
                  Assessment Collections
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
            Select an assessment{" "}
            {assessmentsOrCollections === "collections" && "collection"}{" "}
            from the list below to view its assigned{" "}
            {assessmentsOrCollections === "collections"
              ? "managers"
              : "users"}
            .
          </p>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          {assessmentsOrCollections === "assessments" && (
            <AssessmentsTable
              assessments={assessments}
              assessmentType={assessmentType}
            />
          )}
          {assessmentsOrCollections === "collections" && (
            <CollectionsTable
              collections={collections}
              assessmentType={assessmentType}
            />
          )}
        </div>
      </section>
    </div>
  )
}
