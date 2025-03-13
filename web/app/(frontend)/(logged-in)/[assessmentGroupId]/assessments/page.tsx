import { fetchAssessmentType } from "../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableAssessments, isAdmin, isCollectionManager } from "../../utils/permissions"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string } }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(session, params.assessmentGroupId)

  const canAdd = isAdmin(session) || isCollectionManager(session)

  if(assessmentType) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <div className="flex flex-col max-sm:space-y-2 sm:flex-row justify-between">
                        <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name}</h1>
                        {canAdd && <div className="flex flex-col max-sm:space-y-2 sm:flex-row sm:space-x-2 justify-end">
                            <Link
                                href={`/${assessmentType.id}/assessments/manage-collections`}
                                prefetch={false}
                            >
                                <Button>Manage Assessment Collections</Button>
                            </Link>
                            <Link
                                href={`/${assessmentType.id}/assessments/add-assessment`}
                                prefetch={false}
                            >
                                <Button>Add Assessment</Button>
                            </Link>
                        </div>}
                    </div>
                </div>
            </section>
            <section className="mb-16">
              <div className="space-y-4">
                <DataTable 
                  assessments={assessments} 
                  assessmentType={assessmentType} 
                  session={session}
                />
              </div>
            </section>
        </div>
    )
  }
}