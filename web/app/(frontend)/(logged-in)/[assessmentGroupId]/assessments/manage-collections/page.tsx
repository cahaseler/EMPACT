"use client"
import { useState } from "react"
import { fetchAssessmentType } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableCollections } from "../../../utils/permissions"

import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import AddCollection from "./add-collection"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(session, params.assessmentGroupId)

  const [isAdding, setIsAdding] = useState<boolean>(false)

  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      },
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage="Manage Assessment Collections" />
            <div className="flex flex-col max-sm:space-y-2 sm:flex-row sm:space-x-2 justify-between">
              <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name} Collections</h1>
              {!isAdding ? 
                <Button 
                  onClick={() => setIsAdding(true)} 
                  variant="default" 
                  size="default"
                >
                  Add Assessment Collection
                </Button>
              : 
                <Button 
                  onClick={() => setIsAdding(false)} 
                  variant="outline" 
                  size="default"
                >
                  Cancel
                </Button>
              }
            </div>
          </div>
        </section>
        {isAdding && <AddCollection assessmentTypeId={assessmentType.id} session={session}/>}
        <section className="mb-16">
          <div className="space-y-4">
            <DataTable 
              collections={collections} 
              assessmentType={assessmentType} 
              session={session}
            />
          </div>
        </section>
      </div>
    )
  }
}