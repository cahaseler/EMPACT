import Link from "next/link"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  fetchAssessment,
  fetchAssessmentType,
  fetchAssessmentUserGroups,
  fetchAssessmentUsers,
} from "../../../../utils/dataFetchers"
import {
  isAdmin,
  isLeadForAssessment,
  isManagerForCollection,
} from "../../../../utils/permissions"
import DataTable from "./data-table"

export default async function Page(
  props: Readonly<{
    params: { assessmentGroupId: string; assessmentId: string }
  }>
) {
  const params = await props.params
  const session = await auth()

  const users = await fetchAssessmentUsers(params.assessmentId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
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
    ]
    const canAddEdit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, assessment.id.toString()) ||
      permissions?.find(
        (permission) => permission.name === "Move users between groups"
      ) !== undefined
    const canRegroup =
      isAdmin(session) ||
      isManagerForCollection(session, assessment?.assessmentCollectionId) ||
      isLeadForAssessment(session, assessment.id.toString()) ||
      permissions?.find(
        (permission) => permission.name === "Manage user groups"
      ) !== undefined
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs
              links={links}
              currentPage={`${assessment.name} Users`}
            />
            <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">
                  {assessment.name} Users
                </h1>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {assessment.description}
                </p>
              </div>
              <div className="flex flex-row space-x-2 justify-end">
                {canRegroup && (
                  <Link
                    href={`/${assessmentType.id}/users/assessment/${assessment.id}/manage-user-groups`}
                    prefetch={false}
                  >
                    <Button>Manage User Groups</Button>
                  </Link>
                )}
                {canAddEdit && (
                  <AddUsersButton
                    assessmentTypeId={assessmentType.id}
                    assessmentId={assessment.id}
                    doGroupsExist={groups.length > 0}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            <DataTable
              users={users}
              assessment={assessment}
              assessmentType={assessmentType}
              groups={groups}
              canEdit={canAddEdit}
            />
          </div>
        </section>
      </div>
    )
  }
}

function AddUsersButton({
  assessmentTypeId,
  assessmentId,
  doGroupsExist,
}: Readonly<{
  assessmentTypeId: number
  assessmentId: number
  doGroupsExist: boolean
}>) {
  return doGroupsExist ? (
    <Link
      href={`/${assessmentTypeId}/users/assessment/${assessmentId}/add-assessment-users`}
      prefetch={false}
    >
      <Button>Add Users to Assessment</Button>
    </Link>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="cursor-default opacity-50">
            Add Users to Assessment
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-60 text-center">
          In order to add users to this assessment, you must create at least one
          user group.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
