import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotAuthorized from "@/app/(frontend)/components/notAuthorized"
import { auth } from "@/auth"
import {
  fetchAssessment,
  fetchAssessmentType,
  fetchAssessmentUserGroups,
} from "../../../../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  isLeadForAssessment,
} from "../../../../../utils/permissions"
import AddGroup from "./add-group"
import DataTable from "./data-table"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const permissions = session?.user?.assessmentUser.find(
    (assessmentUser) =>
      assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/users`,
        name: `${assessmentType.name} Users`,
      },
      {
        url: `/${assessmentType.id}/users/assessment/${assessment.id}`,
        name: `${assessment.name} Users`,
      },
    ]
    const canEdit =
      isAdmin(session) ||
      isCollectionManager(session) ||
      isLeadForAssessment(session, params.assessmentId) ||
      permissions?.find(
        (permission) => permission.name === "Manage user groups"
      ) !== undefined
    if (canEdit) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4">
              <Breadcrumbs
                links={links}
                currentPage="Edit Assessment User Groups"
              />
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
    return <NotAuthorized links={links} pageType="Edit Assessment User Groups" />
  }
}
