import { AssessmentType } from "@/prisma/mssql/generated/client"
import * as assessmentType from "@/app/utils/assessmentType"

import { Types } from "./types"

async function fetchAssessmentTypes(): Promise<AssessmentType[]> {
  return await assessmentType.findMany({})
}

export default async function Page() {

  const assessmentTypes = await fetchAssessmentTypes()
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Types data={assessmentTypes}/>
    </div>
  )
}