import { auth as clerkAuth } from "@clerk/nextjs/server"

// In the previous code, this is where NextAuth was configured and called.
// After our migration to Clerk, this is simply a function that takes the clerk session information
// and returns it in the exact same format as NextAuth did, so we don't have to update every page
export async function auth() {
  const clerkSession = await clerkAuth()
  const clerkSessionClaims =
    clerkSession?.sessionClaims as CustomJwtSessionClaims

  const session: Session = {
    user: {
      id: clerkSessionClaims.metadata.databaseId?.toString() ?? "",
      email: clerkSessionClaims.user.email ?? "",
      last_name: clerkSessionClaims.user.last_name,
      first_name: clerkSessionClaims.user.first_name,
      name: clerkSessionClaims.user.name,
      systemRoles: clerkSessionClaims.metadata.systemRoles ?? [],
      assessmentUser: clerkSessionClaims.metadata.assessmentUser ?? [],
      assessmentCollectionUser:
        clerkSessionClaims.metadata.assessmentCollectionUser ?? [],
    },
  }

  return session
}

export type SystemRole = {
  name: string
  id: number
}

export type AssessmentUser = {
  id: number
  role: string
  assessmentId: number
  userId: number
  assessmentUserGroupId: number | null
  participantParts: {
    id: number
    status: string
    date: Date
    partId: number
    assessmentId: number
  }[]
  permissions: {
    id: number
    name: string
  }[]
}

export type AssessmentCollectionUser = {
  id: number
  role: string
  assessmentCollectionId: number
  userId: number
}

export interface Session {
  user: {
    id: string
    email: string
    last_name?: string
    first_name?: string
    name: string
    systemRoles: SystemRole[]
    assessmentUser: AssessmentUser[]
    assessmentCollectionUser: AssessmentCollectionUser[]
  }
}
