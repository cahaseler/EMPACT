import Link from "next/link"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { DropdownMenuWithChildren } from "@/components/ui/dropdown-menu"
import {
  fetchAssessment,
  fetchAssessmentParts,
  fetchAssessmentType
} from "../../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  isFacForAssessment,
  isLeadForAssessment,
  isManagerForCollection,
  viewableCollections
} from "../../../utils/permissions"

import ArchiveModule from "../archive-module"
import AssessmentContent from "./assessment"
import EditModule from "../edit-module"
import SubmitModule from "../submit-module"

export default async function Page(
  props: Readonly<{
    params: { assessmentGroupId: string; assessmentId: string }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(session, params.assessmentGroupId)
  const parts = await fetchAssessmentParts(params.assessmentId)
  const assessmentUser = session?.user?.assessmentUser.find(
    (assessmentUser) =>
      assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )
  const permissions = assessmentUser?.permissions

  if (assessmentType && assessment) {

    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
    ]

    const canEdit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId) ||
      permissions?.find((permission) => permission.name === "Edit assessment") !==
      undefined
    const canEditCollection = isAdmin(session) || isCollectionManager(session)
    const canEditStatus =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId)
    const canView =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, assessment.id.toString()) ||
      isFacForAssessment(session, assessment.id.toString())
    const canArchive =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      permissions?.find(
        (permission) => permission.name === "Archive assessment"
      ) !== undefined

    const assessmentHasFinalizedParts = parts.some((part) => part.status === "Final")

    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <div className="flex flex-col items-center max-md:space-y-2 md:flex-row justify-between md:items-end">
              <h1 className="text-3xl font-bold tracking-tighter">
                {assessment.name}
              </h1>
              {(canEdit || canEditStatus || canEditCollection || canView || canArchive) &&
                <DropdownMenuWithChildren size="default">
                  <div className="flex flex-col space-y-2 p-2 items-center">
                    {canEdit && (
                      <div>
                        <EditModule
                          assessmentType={assessmentType}
                          assessment={assessment}
                          assessmentCollections={collections}
                          canEditCollection={canEditCollection}
                          canEditStatus={canEditStatus}
                          buttonType="default"
                        />
                      </div>
                    )}
                    {canView && assessment.status !== "Final" && assessment.status !== "Archived" && (
                      <div>
                        <Link
                          href={`/${assessmentType.id}/users/assessment/${assessment.id}`}
                          prefetch={false}
                        >
                          <Button>Manage Assessment Users</Button>
                        </Link>
                      </div>
                    )}
                    {assessment.status === "Final" && (
                      <div>
                        <Link
                          href={`/${assessmentType.id}/reports/${assessment.id}`}
                          prefetch={false}
                        >
                          <Button>View Assessment Reports</Button>
                        </Link>
                      </div>
                    )}
                    {canEditStatus && assessmentHasFinalizedParts &&
                      <div>
                        <Link
                          href={`/${assessmentType.id}/assessments/${assessment.id}/export-assessment-data`}
                          prefetch={false}
                        >
                          <Button>Export Assessment Data</Button>
                        </Link>
                      </div>
                    }
                    {canEditStatus && assessment.status !== "Final" && assessment.status !== "Archived" &&
                      <SubmitModule assessment={assessment} buttonType="default" />
                    }
                    {canArchive &&
                      <ArchiveModule
                        assessment={assessment}
                        assessmentTypeId={assessmentType.id}
                        buttonType="default"
                      />
                    }
                  </div>
                </DropdownMenuWithChildren>
              }
            </div>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              {assessment.description}
            </p>
          </div>
        </section>
        <section className="mb-16">
          <AssessmentContent
            assessment={assessment}
            assessmentType={assessmentType}
            parts={parts}
            session={session}
          />
        </section>
      </div>
    )
  }
}
