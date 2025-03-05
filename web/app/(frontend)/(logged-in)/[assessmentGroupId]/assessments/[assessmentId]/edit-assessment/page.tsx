import { 
    fetchAssessmentType, 
    fetchAssessmentCollections,
    fetchAssessment,
    fetchAssessmentParts,
    fetchAssessmentUsers,
    fetchAssessmentParticipants,
    fetchAllResponsesForAssessment
} from "../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { 
    isAdmin, 
    isCollectionManager,
    isManagerForCollection,
    isLeadForAssessment,
    viewableCollections
} from "../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import SubmitModule from "./submit-module"
import ArchiveModule from "../../archive-module"
import EditForm from "./edit-form"
import PartsTable from "./parts-table"

export default async function Page({ params }: Readonly<{ params: { 
    assessmentGroupId: string,
    assessmentId: string 
} }>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessmentCollections = await fetchAssessmentCollections(params.assessmentGroupId)
  const editableCollections = await viewableCollections(session, params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentParts = await fetchAssessmentParts(params.assessmentId)
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
  const assessmentParticipants = await fetchAssessmentParticipants(params.assessmentId)
  const userResponses = await fetchAllResponsesForAssessment(params.assessmentId)

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`, 
        name: assessment.name
      },
    ]
    const permissions = session?.user?.assessmentUser.find(assessmentUser => 
        assessmentUser.assessmentId === assessment.id
    )?.permissions
    const canEdit = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        isLeadForAssessment(session, params.assessmentId) || 
        permissions?.find(permission => permission.name === "Edit assessment") !== undefined
    const canEditCollection = isAdmin(session) || isCollectionManager(session)
    const canEditStatus = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        isLeadForAssessment(session, params.assessmentId)
    const canArchive =
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        permissions?.find(permission => permission.name === "Archive assessment") !== undefined
    if (canEdit) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4">
                        <Breadcrumbs links={links} currentPage="Edit Assessment" />
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl font-bold tracking-tighter">Edit {assessment.name}</h1>
                            <div className="flex flex-col sm:flex-row justify-end max-sm:space-y-4 sm:space-x-4 ml-4">
                                {canEditStatus && <SubmitModule assessment={assessment} />}
                                {canArchive && 
                                    <ArchiveModule 
                                        assessment={assessment} 
                                        assessmentTypeId={assessmentType.id} 
                                        assessmentUsers={assessmentUsers}
                                        buttonType="default" 
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <EditForm 
                        assessment={assessment} 
                        assessmentCollections={canEditCollection ? editableCollections : assessmentCollections}
                        canEditCollection={canEditCollection}
                        canEditStatus={canEditStatus}
                    />
                </section>
                <section className="mb-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold max-lg:ml-2">Assessment Parts</h2>
                        <PartsTable 
                            assessmentParts={assessmentParts}
                            canEditStatus={canEditStatus}
                            numAssessmentUsers={assessmentParticipants.length}
                            userResponses={userResponses}
                        />
                    </div>
                </section>
            </div>
        )
    }
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <Breadcrumbs links={links} currentPage={`Edit ${assessment.name}`} />
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                        You are not authorized to view this page.
                    </p>
                </div>
            </section>
        </div>
    )
  }
}