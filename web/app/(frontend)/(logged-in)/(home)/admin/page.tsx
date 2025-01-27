import { fetchUsers, fetchAllAssessments } from "../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin } from "../../utils/permissions"

import DataTable from "./data-table"

export default async function Page() {
  const session = await auth()

  const isUserAdmin = isAdmin(session)
  const users = await fetchUsers()
  const assessments = await fetchAllAssessments()

  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <DataTable isAdmin={isUserAdmin} users={users} assessments={assessments} />
    </div>
  )
}