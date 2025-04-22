import {
  User,
  Attribute,
  AssessmentPart,
  AssessmentUserResponse,
  Part,
  Section,
} from "@/prisma/mssql/generated/client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation({
  urlHead,
  assessmentId,
  prevAttribute,
  nextAttribute,
  isParticipant,
  userResponses
}: {
  urlHead: string,
  assessmentId: number,
  prevAttribute: Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null,
  nextAttribute: Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null,
  isParticipant: boolean,
  userResponses: (AssessmentUserResponse & { user?: User })[]
}) {
  const prevAttributeAssessmentPart = prevAttribute ? prevAttribute.section.part.assessmentPart.find(
    part => part.assessmentId === assessmentId
  ) : null
  const nextAttributeAssessmentPart = nextAttribute ? nextAttribute.section.part.assessmentPart.find(
    part => part.assessmentId === assessmentId
  ) : null
  return (
    <section className="mb-8 space-y-4">
      <div className={"w-full flex flex-row " + (prevAttribute ? "justify-between" : "justify-end")}>
        {(prevAttribute && prevAttributeAssessmentPart?.status === "Active") &&
          <Link href={`${urlHead}/${prevAttribute.id}`}>
            <Button>Previous</Button>
          </Link>
        }
        {(nextAttribute && nextAttributeAssessmentPart?.status === "Active") && (
          isParticipant && userResponses.length === 0 ?
            <Button disabled={true}>
              Next
            </Button>
            :
            <Link href={`${urlHead}/${nextAttribute.id}`}>
              <Button>
                Next
              </Button>
            </Link>
        )
        }
      </div>
    </section>
  )
}