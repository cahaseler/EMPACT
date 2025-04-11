import { 
  User,
  Attribute,
  AssessmentUserResponse 
} from "@/prisma/mssql/generated/client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation({
  urlHead,
  prevAttribute,
  nextAttribute,
  isParticipant,
  userResponses
}: {
  readonly urlHead: string,
  readonly prevAttribute: Attribute | null,
  readonly nextAttribute: Attribute | null,
  readonly isParticipant: boolean,
  readonly userResponses: (AssessmentUserResponse & { user?: User })[]
}) {
  return (
    <section className="mb-8 space-y-4">
        <div className={"w-full flex flex-row " + (prevAttribute ? "justify-between" : "justify-end")}>
          {prevAttribute && 
            <Link href={`${urlHead}/${prevAttribute.id}`}>
              <Button>Previous</Button>
            </Link>
          }
          {nextAttribute && (
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