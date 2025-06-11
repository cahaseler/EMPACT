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
  prevAttribute,
  nextAttribute,
  isParticipating,
  userResponses,
  canReview
}: {
  urlHead: string,
  prevAttribute: Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null,
  nextAttribute: Attribute & { section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } | null,
  isParticipating: boolean,
  userResponses: (AssessmentUserResponse & { user?: User })[]
  canReview: boolean
}) {
  const prevSectionId = prevAttribute ? prevAttribute.section.id : null
  const nextSectionId = nextAttribute ? nextAttribute.section.id : null
  const urlPrevAttributeId = prevAttribute ? prevAttribute.id.replace(".", "") : null
  const urlNextAttributeId = nextAttribute ? nextAttribute.id.replace(".", "") : null
  return (
    <section className="mb-8 space-y-4">
      <div className={"w-full flex flex-row " + (prevAttribute ? "justify-between" : "justify-end")}>
        {prevAttribute &&
          <Link href={`${urlHead}/${prevSectionId}/${urlPrevAttributeId}`}>
            <Button>Previous</Button>
          </Link>
        }
        {nextAttribute ?
          (
            isParticipating && userResponses.length === 0 ?
              <Button disabled={true}>
                Next
              </Button>
              :
              <Link href={`${urlHead}/${nextSectionId}/${urlNextAttributeId}`}>
                <Button>
                  Next
                </Button>
              </Link>
          ) : (
            isParticipating && (
              canReview ?
                <Link href={`${urlHead}/review-all-responses`}>
                  <Button>
                    Review All Responses
                  </Button>
                </Link>
                :
                <Button disabled>
                  Review All Responses
                </Button>
            )
          )
        }
      </div>
    </section>
  )
}