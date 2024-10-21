import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"


/** Page below is just a placeholder/proof of concept, needs to be replaced **/

export function Home({ data }: Readonly<{data: unknown}>) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">EMPACT</h1>
          <p className="text-base text-muted-foreground md:text-lg/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
            Environment and Maturity Program Assessment and Control Tool
          </p>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Continue Recent Assessment</h2>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            LANL Maturity Assessment - Site Leaders
          </Link>
        </div>
      </section>
      <section>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Previous Assessments</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle>Q4 2023 Assessment</CardTitle>
                  <CardDescription>Completed on 12/31/2023</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    View Report
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Environment
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Maturity
                  </Link>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle>Q3 2023 Assessment</CardTitle>
                  <CardDescription>Completed on 09/30/2023</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    View Report
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Environment
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Maturity
                  </Link>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex justify-between">
                <div>
                  <CardTitle>Q2 2023 Assessment</CardTitle>
                  <CardDescription>Completed on 06/30/2023</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    View Report
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Environment
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-4 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Maturity
                  </Link>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
