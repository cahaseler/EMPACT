import { 
    fetchAssessmentType, 
    fetchAssessment,
    fetchAssessmentUser,
    fetchAssessmentUserGroups,
    fetchAssessmentParts,
    fetchPermissions
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
    isAdmin, 
    isCollectionManager,
    isLeadForAssessment,
    isFacForAssessment
} from "../../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DeleteModule from "../delete-module"
import EditForm from "./edit-form"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string,
    assessmentId: string,
    assessmentUserId: string 
} }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentUser = await fetchAssessmentUser(params.assessmentUserId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const parts = await fetchAssessmentParts(params.assessmentId)
  const permissions = await fetchPermissions()

  if (assessmentType && assessment && assessmentUser) {
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
        isFacForAssessment(session, params.assessmentId)
    const canEditPermissions = 
        isAdmin(session) || 
        isCollectionManager(session) || 
        isLeadForAssessment(session, assessment.id.toString())
    if (canEdit) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4">
                        <Breadcrumbs links={links} currentPage="Edit Assessment User" />
                        <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between md:space-x-4">
                            <h1 className="text-3xl font-bold tracking-tighter">
                                Edit {assessment.name} User - {assessmentUser.user.firstName} {assessmentUser.user.lastName}
                            </h1>
                            <DeleteModule 
                                assessmentUser={assessmentUser} 
                                assessmentTypeId={assessmentType.id} 
                                assessmentId={assessment.id} 
                                buttonType="default" 
                            />
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <EditForm 
                        assessmentUser={assessmentUser} 
                        groups={groups} 
                        parts={parts} 
                        permissions={permissions} 
                        canEditPermissions={canEditPermissions}
                    />
                </section>
            </div>
        )
    }
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <Breadcrumbs links={links} currentPage="Edit Assessment User" />
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                        You are not authorized to view this page.
                    </p>
                </div>
            </section>
        </div>
    )
  }
}