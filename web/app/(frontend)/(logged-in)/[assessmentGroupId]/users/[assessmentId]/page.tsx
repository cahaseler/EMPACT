import { fetchAssessmentType, fetchAssessment, fetchAssessmentUsers } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
  isAdmin,
  isManagerForCollection,
  isLeadForAssessment,
  isFacForAssessment
} from "../../../utils/permissions"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, assessmentId: string } }>) {
  const session = await auth()

  const users = await fetchAssessmentUsers(params.assessmentId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const permissions = session?.user?.assessmentUser.find(assessmentUser => 
    assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions

  if(assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/users`, 
        name: `${assessmentType.name} Users`
      },
    ]
    const canAddEdit = 
      isAdmin(session) || 
      isManagerForCollection(session, assessment.assessmentCollectionId) || 
      isLeadForAssessment(session, assessment.id.toString()) || 
      isFacForAssessment(session, assessment.id.toString())
    const canRegroup = 
      isAdmin(session) || 
      isManagerForCollection(session, assessment?.assessmentCollectionId) || 
      isLeadForAssessment(session, assessment.id.toString()) || 
      permissions?.find(permission => permission.name === "Regroup users") !== undefined
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={`${assessment.name} Users`} />
            <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">{assessment.name} Users</h1>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {assessment.description}
                </p>
              </div>
              <div className="flex flex-row space-x-2 justify-end">
                {canRegroup && 
                  <Link
                    href={`/${assessmentType.id}/users/${assessment.id}/regroup-assessment-users`}
                    prefetch={false}
                  >
                    <Button>
                      Manage User Groups
                    </Button>
                  </Link>
                }
                {canAddEdit && 
                  <Link
                    href={`/${assessmentType.id}/users/${assessment.id}/add-assessment-users`}
                    prefetch={false}
                  >
                    <Button>
                      Add Users to Assessment
                    </Button>
                  </Link>
                }
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
              canEdit={canAddEdit}
            />
          </div>
        </section>
      </div>
    )
  }
}
