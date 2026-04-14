import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotAuthorized from "@/app/(frontend)/components/notAuthorized"
import { auth } from "@/auth"
import {
  fetchAssessment,
  fetchAssessmentType,
  fetchAssessmentUsers,
  fetchAssessmentUserGroups
} from "../../../../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  isFacForAssessment,
  isLeadForAssessment,
} from "../../../../../utils/permissions"
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
    const canAdd =
      isAdmin(session) ||
      isCollectionManager(session) ||
      isLeadForAssessment(session, params.assessmentId) ||
      isFacForAssessment(session, params.assessmentId)
    if (canAdd) {
      const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
      const somePartFinalized = assessment.assessmentParts.some((part) => part.status === "Final")

      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4">
              <Breadcrumbs links={links} currentPage="Bulk Edit Assessment Users" />
              <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold tracking-tighter">
                  Bulk Edit {assessment.name} Users
                </h1>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <DataTable
              assessmentTypeId={parseInt(params.assessmentGroupId, 10)}
              assessmentId={parseInt(params.assessmentId, 10)}
              groups={groups}
              assessmentUsers={assessmentUsers}
              somePartFinalized={somePartFinalized}
            />
          </section>
        </div>
      )
    }
    return <NotAuthorized links={links} pageType="Bulk Edit Assessment Users" />
  }
}
