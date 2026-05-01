import Link from "next/link"
import { auth } from "@/auth"
import { format } from "date-fns"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { DropdownMenuWithChildren } from "@/components/ui/dropdown-menu"

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
import EditDateModule from "./edit-date-module"
import EditStatusModule from "./edit-status-module"
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
      const submittableStatuses = ["Active", "Inactive", "Reconciliation"]

      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={`${part.name} Assessment`} />
              <div className="space-y-2">
                <div className="flex flex-row justify-between">
                  <h1 className="text-3xl font-bold tracking-tighter">
                    {assessment.name} {part.name} Assessment
                  </h1>
                  {!isParticipant && (canEdit || canSubmit) &&
                    <DropdownMenuWithChildren size="default">
                      <div className="flex flex-col space-y-2 p-2 items-center">
                        {!isParticipant && assessmentPart && canEdit &&
                          <div>
                            <EditDateModule assessmentPart={assessmentPart} buttonType="default" />
                          </div>
                        }
                        {!isParticipant && assessmentPart && canEdit &&
                          <div>
                            <EditStatusModule
                              urlHead={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.name}`}
                              assessmentPart={assessmentPart}
                              buttonType="default"
                            />
                          </div>
                        }
                        {!isParticipant && canSubmit && submittableStatuses.includes(assessmentPart ? assessmentPart.status : "") &&
                          <div>
                            <SubmitModule
                              urlHead={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.name}`}
                              assessmentPartName={part.name}
                              buttonType="default"
                            />
                          </div>
                        }
                        {!isParticipant && canEdit &&
                          <div>
                            <Link
                              href={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.name}/edit-assessment-part`}
                              prefetch={false}
                            >
                              <Button>Manage {part.attributeType}s</Button>
                            </Link>
                          </div>
                        }
                      </div>
                    </DropdownMenuWithChildren>
                  }
                </div>
                <div className="flex md:flex-row md:space-x-6 max-md:flex-col max-md:space-y-2">
                  <h3 className="text-lg font-semibold">
                    <span className="text-indigo-800 dark:text-indigo-200">Status: </span>
                    {assessmentPart ? assessmentPart.status : ""}
                  </h3>
                  <h3 className="text-lg font-semibold">
                    <span className="text-indigo-800 dark:text-indigo-200">Date: </span>
                    {assessmentPart ? format(assessmentPart.date, "MM/dd/yyyy") : ""}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {part.description}
                </p>
              </div>
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
