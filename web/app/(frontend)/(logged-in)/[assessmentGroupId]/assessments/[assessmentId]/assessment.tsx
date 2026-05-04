import { format } from "date-fns"
import Link from "next/link"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import {
  Assessment,
  AssessmentPart,
  AssessmentType,
  Part
} from "@/prisma/mssql/generated/client"
import {
  canUserParticipateInPart,
  isAdmin,
  isFacForAssessment,
  isLeadForAssessment,
  isManagerForCollection
} from "../../../utils/permissions"

import EditDateModule from "./[roleName]/[partName]/edit-date-module"
import EditStatusModule from "./[roleName]/[partName]/edit-status-module"
import SubmitModule from "./[roleName]/[partName]/submit-module"

export default function AssessmentContent({
  assessment,
  assessmentType,
  parts,
  session,
}: Readonly<{
  assessment: Assessment
  assessmentType: AssessmentType
  parts: (AssessmentPart & { part: Part })[]
  session: Session | null
}>) {
  const canEnterAsFac =
    isAdmin(session) ||
    isManagerForCollection(session, assessment.assessmentCollectionId) ||
    isLeadForAssessment(session, assessment.id.toString()) ||
    isFacForAssessment(session, assessment.id.toString())
  const permissions = session?.user?.assessmentUser.find(
    (assessmentUser) => assessmentUser.assessmentId === assessment.id
  )?.permissions
  const canEdit =
    isAdmin(session) ||
    isManagerForCollection(session, assessment.assessmentCollectionId) ||
    isLeadForAssessment(session, assessment.id.toString()) ||
    permissions?.find(
      (permission) => permission.name === "Edit assessment"
    ) !== undefined
  const canSubmit =
    isAdmin(session) ||
    isManagerForCollection(session, assessment.assessmentCollectionId) ||
    isLeadForAssessment(session, assessment.id.toString())
  const submittableStatuses = ["Active", "Inactive", "Reconciliation"]

  return (
    <div className="w-full flex flex-col space-y-4">
      {parts.map((part: AssessmentPart & { part: Part }, key: number) => {
        const canEnterAsParticipant = canUserParticipateInPart(
          session,
          assessment.id.toString(),
          part.partId
        )
        return (
          <Card className="w-auto" key={key}>
            <CardHeader className="flex justify-between space-y-4 ml-2">
              <div className="flex flex-col space-y-2 max-sm:items-center">
                <div className="flex flex-col sm:flex-row items-center max-sm:space-y-2 justify-between">
                  <CardTitle>{part.part.name} Assessment</CardTitle>
                  <div className="flex flex-col sm:flex-row items-center max-sm:space-y-2 sm:space-x-2">
                    {canEdit &&
                      <EditDateModule
                        assessmentPart={part}
                        buttonType="icon"
                      />
                    }
                    {canEdit &&
                      <EditStatusModule
                        urlHead={`/${assessmentType.id}/assessments/${assessment.id}`}
                        assessmentPart={part}
                        buttonType="icon"
                      />
                    }
                    {canSubmit && submittableStatuses.includes(part.status) &&
                      <SubmitModule
                        urlHead={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.part.name}`}
                        assessmentPartName={part.part.name}
                        buttonType="icon"
                      />
                    }
                  </div>
                </div>
                <CardDescription className="flex flex-col sm:flex-row items-center sm:space-x-6 max-sm:space-y-2 justify-start">
                  <span>
                    <Label>Status:</Label> {part.status}
                  </span>
                  <span>
                    <Label>Date:</Label> {format(part.date, "MM/dd/yyyy")}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-2 max-sm:space-y-2 justify-start">
                {canEnterAsFac &&
                  <Link
                    href={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.part.name}`}
                    prefetch={false}
                  >
                    <Button variant="secondary">
                      Enter as Facilitator
                    </Button>
                  </Link>
                }
                {canEnterAsParticipant && (
                  part.status === "Active" || part.status === "Reconciliation" ? (
                    <Link
                      href={`/${assessmentType.id}/assessments/${assessment.id}/Participant/${part.part.name}`}
                      prefetch={false}
                    >
                      <Button variant="secondary">
                        Enter as Participant
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" disabled>
                      Enter as Participant
                    </Button>
                  )
                )}
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
