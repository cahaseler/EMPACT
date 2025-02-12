import { fetchAssessmentType } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableCollections } from "../../../utils/permissions"

import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(session, params.assessmentGroupId)

  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-3 pb-10">
      <DataTable 
        collections={collections} 
        assessmentType={assessmentType} 
        session={session}
       />
    </div>
  )
}