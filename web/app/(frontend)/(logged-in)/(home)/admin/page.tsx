import { fetchUsers } from "../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin } from "../../utils/permissions"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import DataTable from "./data-table"

export default async function Page() {
  const session = await auth()

  const isUserAdmin = isAdmin(session)
  const users = await fetchUsers()

  if (isUserAdmin) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">Admin Settings</h1>
              </div>
              <div className="flex flex-row space-x-2">
                  <Link href={`/admin/add-users`} prefetch={false}>
                    <Button>Add Users</Button>
                  </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            <DataTable users={users} />
          </div>
        </section>
      </div>
    )
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-8 max-lg:ml-2">
          <p className="text-md text-muted-foreground dark:text-indigo-300/80">
            You are not authorized to view this page.
          </p>
        </div>
      </section>
    </div>
  )
}