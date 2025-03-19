import { fetchAssessmentType, fetchUsers } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { viewableCollections } from "../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import AddCollection from "./add-collection"
import DataTable from "./data-table"

export default async function Page(props: Readonly<{ params: { assessmentGroupId: string } }>) {
  const params = await props.params;
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(session, params.assessmentGroupId)
  const users = await fetchUsers()

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
              <AddCollection assessmentTypeId={assessmentType.id} session={session} users={users}/>
            </div>
          </div>
        </section>
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