import { AssessmentType } from "@/prisma/mssql/generated/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Types({ data }: Readonly<{data: AssessmentType[]}>) {
  return (
    <div className="w-full max-w-4xl mx-auto">
    <section className="mb-4">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">EMPACT</h1>
            {/* TODO: Update copy */}
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                The Environment and Maturity Program Assessment and Control Tool is an open-source implementation of the IP2M METRR Environmental and Maturity evaluation model, developed under sponsorship by the Department of Energy's Office of Project Management in collaboration with the Earned Value community. This project aims to provide a robust tool for assessing and controlling project management maturity and environmental factors. This project is based on the groundbreaking DOE-funded IP2M METRR research by Arizona State University, but is not affiliated or sponsored by ASU and is not based on ASU's proprietary IP2M METRR software.
            </p>
        </div>
    </section>
    <section className="mb-8">
        {/* TODO: Update copy */}
            <p>
                Click on an assessment type from the list below to access your assessment.
            </p>
    </section>
    <section className="mb-16">
        <div className="flex flex-col space-y-4">
            {data.map((type: AssessmentType, key: number) => {
                return (
                    <Link key={key} href={`/${type.id}`} prefetch={false}>
                        <Button size="xl">
                            <h1 className="w-full text-2xl font-semibold leading-none tracking-tight">{type.name}</h1>
                        </Button>
                    </Link>
                )
            })}
        </div>
    </section>
    </div>
  )
}
