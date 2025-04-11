import { format } from "date-fns"
import Link from "next/link"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Assessment,
  AssessmentPart,
  AssessmentType,
  Part,
} from "@/prisma/mssql/generated/client"
import {
  canUserParticipateInPart,
  isAdmin,
  isFacForAssessment,
  isLeadForAssessment,
  isManagerForCollection,
} from "../../../utils/permissions"

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

  return (
    <div className="w-full flex flex-col space-y-4">
      {parts.map((part: AssessmentPart & { part: Part }, key: number) => {
        const canEnterAsParticipant = canUserParticipateInPart(
          session,
          assessment.id.toString(),
          part.id
        )
        return (
          <Card className="w-auto" key={key}>
            <CardHeader className="flex justify-between space-y-4 ml-2">
              <div className="flex flex-col space-y-2 max-sm:items-center">
                <CardTitle>{part.part.name}</CardTitle>
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
                {canEnterAsFac && (
                  <Link
                    href={`/${assessmentType.id}/assessments/${assessment.id}/Facilitator/${part.part.name}`}
                    prefetch={false}
                    legacyBehavior>
                    <Button variant="secondary">Enter as Facilitator</Button>
                  </Link>
                )}
                {canEnterAsParticipant && (
                  <Link
                    href={`/${assessmentType.id}/assessments/${assessment.id}/Participant/${part.part.name}`}
                    prefetch={false}
                    legacyBehavior>
                    <Button variant="secondary">Enter as Participant</Button>
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
