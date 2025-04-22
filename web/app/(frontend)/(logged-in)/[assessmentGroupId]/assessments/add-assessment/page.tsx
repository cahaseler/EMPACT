import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import {
  fetchAssessmentCollections,
  fetchAssessmentType,
  fetchPartsSectionsAttributes,
} from "../../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  viewableCollections,
} from "../../../utils/permissions"
import AddForm from "./add-form"

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
  const assessmentCollections = await fetchAssessmentCollections(
    params.assessmentGroupId
  )
  const editableCollections = await viewableCollections(
    session,
    params.assessmentGroupId
  )
  const parts = await fetchPartsSectionsAttributes(params.assessmentGroupId)

  if (assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
    ]
    const canAdd = isAdmin(session) || isCollectionManager(session)
    if (canAdd) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4">
              <Breadcrumbs links={links} currentPage="Add Assessment" />
              <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold tracking-tighter">
                  Add Assessment
                </h1>
              </div>
            </div>
          </section>
          <AddForm
            assessmentCollections={
              isAdmin(session) ? assessmentCollections : editableCollections
            }
            assessmentType={assessmentType}
            parts={parts}
          />
        </div>
      )
    }
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage="Add Assessment" />
            <p className="text-md text-muted-foreground dark:text-indigo-300/80">
              You are not authorized to view this page.
            </p>
          </div>
        </section>
      </div>
    )
  }
}
