import Link from "next/link"

import { Button } from "@/components/ui/button"
import { AssessmentType } from "@/prisma/mssql/generated/client"

export function Types({ data }: Readonly<{ data: AssessmentType[] }>) {
  return (
    <section className="mb-16">
      <div className="flex flex-col space-y-4">
        {data.map((type: AssessmentType, key: number) => {
          return (
            <Link key={key} href={`/${type.id}`} prefetch={false} legacyBehavior>
              <Button size="xl">
                <h1 className="w-full text-2xl font-semibold leading-none tracking-tight">
                  {type.name}
                </h1>
              </Button>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
