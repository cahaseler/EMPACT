import { Section } from "@/prisma/mssql/generated/client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation({
  urlHead,
  prevSection,
  nextSection
}: {
  urlHead: string,
  prevSection: Section | null,
  nextSection: Section | null
}) {
  return (
    <section className="mb-8 space-y-4">
      <div className={"w-full flex flex-row " + (prevSection ? "justify-between" : "justify-end")}>
        {prevSection &&
          <Link href={`${urlHead}/${prevSection.id}`}>
            <Button>Previous</Button>
          </Link>
        }
        {nextSection &&
          <Link href={`${urlHead}/${nextSection.id}`}>
            <Button>
              Next
            </Button>
          </Link>
        }
      </div>
    </section>
  )
}