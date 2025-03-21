import { SignIn } from "@clerk/nextjs"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex flex-col w-full mx-auto justify-between sm:p-10 sm:max-w-7xl">
      <section className="mb-8">
        <div className="space-y-2 max-lg:ml-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Welcome to EMPACT
          </h1>
          <p className="text-base text-muted-foreground dark:text-indigo-300/80 md:text-lg/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
            Environment and Maturity Program Assessment and Control Tool
          </p>
        </div>
      </section>
      <div className="flex max-sm:flex-col flex-row w-full mx-auto justify-between">
        <section className="sm:w-2/3 sm:mr-8 max-sm:mb-4">
          <Card className="w-auto bg-indigo-200/80 border-indigo-300 dark:bg-indigo-400/80 dark:border-indigo-500 dark:text-black">
            <CardHeader className="p-4">
              <div className="space-y-1">
                <CardTitle className="max-sm:text-center">
                  Security Notice
                </CardTitle>
              </div>
              <div className="text-sm text-description">
                <p>
                  This is a Federal Government system for the U.S. Department of
                  Energy. Users will be held accountable for their actions while
                  using the PARS application. Any unauthorized access or
                  inappropriate use of this application is prohibited and could
                  be subject to criminal or civil penalties.
                </p>
                <p>
                  Users are granted access to the EMPACT application based on a
                  need to access specific information. Users are not to attempt
                  to access information to which access has not been authorized.
                  All attempts to access this system are logged and unauthorized
                  access will be prosecuted.
                </p>
              </div>
            </CardHeader>
          </Card>
        </section>
        <section className="sm:w-1/3 sm:ml-8 max-sm:mt-4">
          <SignIn />
        </section>
      </div>
    </div>
  )
}
