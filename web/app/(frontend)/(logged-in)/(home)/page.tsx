import { fetchAssessmentTypes } from "../utils/dataFetchers"

import { Types } from "./types"

export default async function Page() {
  const assessmentTypes = await fetchAssessmentTypes()
  
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <Types data={assessmentTypes}/>
    </div>
  )
}