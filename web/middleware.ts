import type { User } from "./prisma/mssql/generated/client"

import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import {
  AssessmentCollectionUser,
  AssessmentPart,
  AssessmentUser,
  Permission,
  User as PrismaUser,
  SystemRole,
} from "./prisma/mssql/generated/client"

// Type for a User with relations included
interface DbUserWithRelations extends PrismaUser {
  systemRoles: SystemRole[]
  assessmentUser: (AssessmentUser & {
    permissions: Permission[]
    participantParts: AssessmentPart[]
  })[]
  assessmentCollectionUser: AssessmentCollectionUser[]
}

// Clerk session claims type
interface SessionClaims {
  user: {
    email: string
    first_name?: string
    last_name?: string
  }
  metadata: {
    databaseId?: number
    systemRoles?: SystemRole[]
    assessmentUser?: AssessmentUser[]
    assessmentCollectionUser?: AssessmentCollectionUser[]
  }
}

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

function isAuthenticationRequired(req: NextRequest): boolean {
  return !isPublicRoute(req)
}

function isNewlyLoggedIn(sessionClaims: SessionClaims): boolean {
  return !sessionClaims.metadata?.databaseId
}

/**
 * Fetches a user record from the database with their associated roles and permissions metadata.
 * @param email The email address of the user to fetch.
 * @returns The fetched user record with associated metadata, or null if the user does not exist or there was an error.
 */
async function fetchUserFromDatabase(
  email: string
): Promise<DbUserWithRelations | null> {
  try {
    const dbUser = await db.user.findUnique({
      where: { email },
      include: {
        systemRoles: true,
        assessmentUser: {
          include: {
            permissions: true,
            participantParts: true,
          },
        },
        assessmentCollectionUser: true,
      },
    })

    console.log("User permissions metadata:", dbUser)
    return dbUser
  } catch (error) {
    console.error("Error fetching user from database:", error)
    return null
  }
}

/**
 * Checks if a user has no assigned permissions in the system yet and should just be sent to the confirmation page.
 * @param dbUser The user to check, or null if the user does not exist or there was an error.
 * @returns True if the user does not have any roles, permissions, associated assessments, or associated collections.
 */
function shouldConfirmRegistration(
  dbUser: DbUserWithRelations | null
): boolean {
  // If the dbUser is null, it's because they were just created for the first time and therefore don't have permissions
  return (
    !dbUser?.systemRoles?.length &&
    !dbUser?.assessmentUser?.length &&
    !dbUser?.assessmentCollectionUser?.length
  )
}

/**
 * Creates a new user in the database using the given session claims.
 * @param sessionClaims The session claims from Clerk, containing the user's email and first/last name.
 * @returns The created user, or null if there was an error.
 */
async function createUserInDatabase(sessionClaims: SessionClaims) {
  try {
    const user = await db.user.create({
      data: {
        email: sessionClaims?.user.email,
        firstName: sessionClaims?.user.first_name ?? "",
        lastName: sessionClaims?.user.last_name ?? "",
      },
    })
    return user
  } catch (error) {
    console.error("Error creating user in database:", error)
    return null
  }
}

/**
 * Updates an existing user in the database with the latest information from Clerk.
 * @param dbUser The existing user record from the database.
 * @param sessionClaims The session claims from Clerk, containing the user's email and first/last name.
 * @returns The updated user, or null if there was an error.
 */
async function updateUserNameInDatabase(
  dbUser: DbUserWithRelations,
  sessionClaims: SessionClaims
) {
  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        firstName: sessionClaims?.user.first_name ?? "",
        lastName: sessionClaims?.user.last_name ?? "",
      },
    })
  } catch (error) {
    console.error("Error updating user in database:", error)
    return dbUser
  }
}

/**
 * Updates the Clerk metadata with database values
 */
async function updateClerkMetadata(
  dbUser: DbUserWithRelations | null,
  userId: string,
  newUserId: number | null
) {
  const client = await clerkClient()
  if (newUserId) {
    try {
      await client.users.updateUser(userId, {
        publicMetadata: {
          databaseId: newUserId,
        },
      })
    } catch (error) {
      console.error("Error updating Clerk metadata:", error)
    }
  } else {
    try {
      // Update the metadata in the session token
      await client.users.updateUser(userId, {
        publicMetadata: {
          systemRoles: dbUser?.systemRoles,
          assessmentUser: dbUser?.assessmentUser,
          assessmentCollectionUser: dbUser?.assessmentCollectionUser,
          databaseId: dbUser?.id,
        },
      })
    } catch (error) {
      console.error("Error updating Clerk metadata:", error)
    }
  }
}

function nameNeedsUpdate(
  dbUser: DbUserWithRelations | null,
  sessionClaims: SessionClaims
) {
  if (
    dbUser?.firstName !== sessionClaims?.user.first_name ||
    dbUser?.lastName !== sessionClaims?.user.last_name
  ) {
    return true
  }
  return false
}

/**
 * Main middleware function
 */
export default clerkMiddleware(async (auth, req) => {
  // Get session info from Clerk
  const { userId, sessionClaims } = (await auth()) as {
    userId: string | null
    sessionClaims: SessionClaims
  }

  const dbUser = await fetchUserFromDatabase(sessionClaims?.user?.email)

  // If the user is going to a non-public route, redirect them to the login page if they're not logged in
  if (isAuthenticationRequired(req)) {
    await auth.protect()
    // Otherwise, let them continue to the public page
  } else {
    return null
  }

  // type guard - this should never happen
  if (!userId) {
    throw new Error("User is logged in but userId is null")
  } else {
    // Update the our Session metadata with permissions information (and the database User ID) from the database
    await updateClerkMetadata(dbUser, userId, null)
  }

  // Check if session metadata needs to be updated based on the database
  // (this is going to be the case on the first load after all new logins)
  // We'll also take the opportunity to update database user info if it's needed
  if (isNewlyLoggedIn(sessionClaims)) {
    let newUser: User | null = null

    if (!dbUser) {
      //Brand new user, first login, had not been assigned permissions ahead of time
      newUser = await createUserInDatabase(sessionClaims)
    } else {
      if (nameNeedsUpdate(dbUser, sessionClaims)) {
        // User has changed their name in Clerk since last login, update the database
        await updateUserNameInDatabase(dbUser, sessionClaims)
      }
    }

    // Update the our Session metadata with permissions information (and the database User ID) from the database
    await updateClerkMetadata(dbUser, userId, newUser?.id ?? null)

    if (shouldConfirmRegistration(dbUser)) {
      // If the user hasn't actually been assigned any permissions at all in the system yet,
      // Send them to a page thanking them for signing up and telling them to wait for access
      return NextResponse.redirect(new URL("/confirm-registered"))
    }

    // At this point, all of the following should be true:
    //  - Logged out users have been redirected to sign-in
    //  - Logged in users have a database entry that accurately reflects their current Clerk name
    //  - Users without any permissions have been redirected to /confirm-registered
    //  - Users with permissions have their permissions in their Clerk session token
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  runtime: "nodejs",
}
