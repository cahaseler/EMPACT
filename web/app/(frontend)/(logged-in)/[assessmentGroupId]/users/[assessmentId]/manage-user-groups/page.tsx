import { 
    fetchAssessmentType, 
    fetchAssessment,
    fetchAssessmentUserGroups
} from "../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
    isAdmin, 
    isCollectionManager,
    isLeadForAssessment
} from "../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import AddGroup from "./add-group"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string,
    assessmentId: string
} }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const permissions = session?.user?.assessmentUser.find(assessmentUser => 
    assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions

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
    const canEdit = 
        isAdmin(session) || 
        isCollectionManager(session) || 
        isLeadForAssessment(session, params.assessmentId) || 
        permissions?.find(permission => permission.name === "Manage user groups") !== undefined
    if (canEdit) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4">
                        <Breadcrumbs links={links} currentPage="Edit Assessment User Groups" />
                        <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between md:space-x-4">
                            <h1 className="text-3xl font-bold tracking-tighter">
                                {assessment.name} User Groups
                            </h1>
                            <AddGroup assessmentId={assessment.id} />
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <DataTable groups={groups} />
                </section>
            </div>
        )
    }
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <Breadcrumbs links={links} currentPage="Edit Assessment User Groups" />
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                        You are not authorized to view this page.
                    </p>
                </div>
            </section>
        </div>
    )
  }
}