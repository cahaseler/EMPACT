import Link from "next/link"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  fetchAssessment,
  fetchAssessmentPart,
  fetchAssessmentType,
  fetchAssessmentUsers,
  fetchPart,
} from "../../../../../utils/dataFetchers"
import {
  isAdmin,
  isLeadForAssessment,
  isManagerForCollection,
  viewableResponses
} from "../../../../../utils/permissions"

import PartContent from "./part"
import SubmitModule from "./submit-module"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)

  const isParticipant = params.roleName === "Participant"
  const userResponses = await viewableResponses(
    session,
    params.assessmentId,
    params.roleName
  )

  if (assessmentType && assessment) {

    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name,
      },
    ]

    const permissions = session?.user?.assessmentUser.find(
      (assessmentUser) => assessmentUser.assessmentId === assessment.id
    )?.permissions
    const canEdit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId) ||
      permissions?.find(
        (permission) => permission.name === "Edit assessment"
      ) !== undefined
    const canSubmit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId)

    if (part) {

      const assessmentPart = await fetchAssessmentPart(assessment.id, part.id)
      const submittableStatuses = ["Active", "Inactive"]

      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={`${part.name} Assessment`} />
              <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold tracking-tighter">
                  {part.name} Assessment
                </h1>
                <div className="flex flex-row space-x-2">
                  {!isParticipant && canEdit &&
                    <div>
                      <Link
                        href={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.name}/edit-assessment-part`}
                        prefetch={false}
                      >
                        <Button>Edit Assessment Part</Button>
                      </Link>
                    </div>
                  }
                  {!isParticipant && canSubmit && submittableStatuses.includes(assessmentPart ? assessmentPart.status : "") &&
                    <div>
                      <SubmitModule
                        urlHead={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.name}`}
                        assessmentPartName={part.name}
                      />
                    </div>
                  }
                </div>
              </div>
              <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                {part.description}
              </p>
            </div>
          </section>
          <section className="mb-16">
            <PartContent
              assessment={assessment}
              assessmentType={assessmentType}
              assessmentUsers={assessmentUsers}
              isParticipant={isParticipant}
              role={params.roleName}
              part={part}
              userResponses={userResponses}
            />
          </section>
        </div>
      )
    }
  }
}
