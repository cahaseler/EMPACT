// import { signIn } from "@/auth"

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

//TODO: Build out sign in pages - both with username/password for first time setup and them with whatever SSO they have configured

//TODO: Build out some kind of self-config flow to walk them through setting up SSO

export function SignIn() {
  return (
    <div className="flex flex-col w-full mx-auto justify-between">
      <section className="mb-8">
        <div className="space-y-2 max-lg:ml-2">
          <h1 className="text-3xl font-bold tracking-tighter">Welcome to EMPACT</h1>
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
                This is a Federal Government system for the U.S. Department of Energy. Users will be held accountable for their actions while using the PARS application. Any unauthorized access or inappropriate use of this application is prohibited and could be subject to criminal or civil penalties.
                </p>
                <p>
                Users are granted access to the PARS application based on a need to access specific information. Users are not to attempt to access information to which access has not been authorized. All attempts to access this system are logged and unauthorized access will be prosecuted.
                </p>
              </div>
            </CardHeader>
          </Card>
        </section>
        {/* TODO: Connect to form, sign-in functionality */}
        <section className="sm:w-1/3 sm:ml-8 max-sm:mt-4">
          <Card className="w-auto">
            <CardHeader className="p-4">
              <div className="mb-4">
                <CardTitle className="max-sm:text-center">
                  Sign In
                </CardTitle>
              </div>
              <div className="flex flex-col space-y-4 items-center">
                <div className="w-full flex flex-col space-y-2">
                  <h3>Username</h3>
                  <input className="w-full py-2 px-4 border border-indigo-100 dark:border-indigo-900" name="username" type="text" />
                </div>
                <div className="w-full flex flex-col space-y-2">
                  <h3>Password</h3>
                  <input className="w-full py-2 px-4 border border-indigo-100 dark:border-indigo-900" name="password" type="password" />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
                  Sign In
                </button>
                <div className="text-sm text-description">
                  Since you haven't yet configured your installation, you'll need to sign in with your admin credentials. You should have set up your admin username and password in your environment configuration. Use these to log in, and we can configure some other authentication providers.
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>
      </div>
    </div>
  )
}
