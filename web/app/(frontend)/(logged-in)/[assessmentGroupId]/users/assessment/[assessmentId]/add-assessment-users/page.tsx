import { 
    fetchAssessmentType, 
    fetchAssessment,
    fetchAssessmentUserGroups,
    fetchUsers
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
    isAdmin, 
    isCollectionManager,
    isLeadForAssessment,
    isFacForAssessment
} from "../../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string,
    assessmentId: string 
} }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const users = await fetchUsers()

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/users`, 
        name: `${assessmentType.name} Users`
      },
      {
        url: `/${assessmentType.id}/users/${assessment.id}`, 
        name: `${assessment.name} Users`
      },
    ]
    const canAdd = 
        isAdmin(session) || 
        isCollectionManager(session) || 
        isLeadForAssessment(session, params.assessmentId) || 
        isFacForAssessment(session, params.assessmentId)
    if (canAdd) {
        const usersNotInAssessment = users.filter(user => user.assessmentUser.find(uc => uc.assessmentId === parseInt(params.assessmentId, 10)) === undefined)
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4">
                        <Breadcrumbs links={links} currentPage="Add Assessment Users" />
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl font-bold tracking-tighter">Add Users to {assessment.name}</h1>
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <DataTable 
                        users={usersNotInAssessment} 
                        assessmentId={assessment.id} 
                        assessmentTypeId={assessmentType.id} 
                        groups={groups}
                    />
                </section>
            </div>
        )
    }
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <Breadcrumbs links={links} currentPage="Add Assessment Users" />
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                        You are not authorized to view this page.
                    </p>
                </div>
            </section>
        </div>
    )
  }
}