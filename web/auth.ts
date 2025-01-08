import type { User } from "next-auth"
import type { SystemRole, AssessmentUser, AssessmentCollectionUser } from "./prisma/mssql/generated/client"
import { db } from "./lib/db"

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    id?: string
    email?: string | null
    name?: string | null
    systemRoles?: SystemRole[]
    assessmentUser?: AssessmentUser[]
    assessmentCollectionUser?: AssessmentCollectionUser[]
  }

  interface Session {
    user: User & {
      id: string
      email: string
      name: string
      systemRoles: SystemRole[]
      assessmentUser: AssessmentUser[]
      assessmentCollectionUser: AssessmentCollectionUser[]
    }
  }
}
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { testAccounts } from "./tests/e2e/test-accounts"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  debug: true, // Enable debug logging during testing
  pages: {
    signIn:
      process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true"
        ? "/test-auth"
        : "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // For the admin user, we don't need to fetch additional data
        if (user.id === "Admin") {
          token.id = user.id
          token.email = user.email ?? ""
          token.name = user.name ?? "Admin"
          token.systemRoles = []
          token.assessmentUser = []
          token.assessmentCollectionUser = []
          return token
        }

        // For regular users, fetch their data from the database
        const dbUser = await db.user.findUnique({
          where: { email: user.email ?? undefined },
          include: {
            systemRoles: true,
            assessmentUser: true,
            assessmentCollectionUser: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id.toString()
          token.email = dbUser.email
          token.name = `${dbUser.firstName} ${dbUser.lastName}`
          token.systemRoles = dbUser.systemRoles
          token.assessmentUser = dbUser.assessmentUser
          token.assessmentCollectionUser = dbUser.assessmentCollectionUser
        } else {
          token.id = user.id ?? ""
          token.email = user.email ?? ""
          token.name = user.name ?? ""
          token.systemRoles = []
          token.assessmentUser = []
          token.assessmentCollectionUser = []
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.systemRoles = (token.systemRoles as SystemRole[]) ?? []
        session.user.assessmentUser = (token.assessmentUser as AssessmentUser[]) ?? []
        session.user.assessmentCollectionUser = (token.assessmentCollectionUser as AssessmentCollectionUser[]) ?? []
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  providers: [
    /* The credentials provider is only used for the Admin user on first login so they can configure the secure login options to use in the future.
     * Using credential based authentication is likely a bad idea in most security contexts due to lack of multifactor authentication.
     This application is written to make it easy to set up a variety of Single Sign On (SSO) providers or to use 'Magic Links' for temporary non-priviliged users.
    
     * If you do *really really* want to use credential based authentication, you'll need to rewrite this with security in mind.
     * You can start that here: https://authjs.dev/getting-started/authentication/credentials
     * But don't. */
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        if (
          credentials.password === process.env.SETUP_ADMIN_PASSWORD &&
          credentials.email === "admin"
        ) {
          user = {
            id: "Admin",
            name: "Admin",
            email: "",
          } as User
        }

        if (!user) {
          throw new Error(
            "Admin user not found. Make sure to set your initial admin password in your environment configuration."
          )
        }

        return user
      },
    }),
    ...(process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true"
      ? [
        Credentials({
          id: "test-credentials",
          name: "Test Credentials",
          credentials: {
            email: {},
            password: {},
          },
          async authorize(credentials): Promise<User | null> {
            try {
              const { email, password } =
                await signInSchema.parseAsync(credentials)

              // Verify it's a test account
              if (!Object.values(testAccounts).includes(email)) {
                console.log("Invalid test account:", email)
                return null
              }

              // Verify password matches environment variable
              if (password !== process.env.TEST_USER_PASSWORD) {
                console.log("Invalid password for test account")
                return null
              }

              const user = {
                id: email,
                email,
                name:
                  email
                    .split("@")[0]
                    .split("_")[0]
                    .toUpperCase() +
                  " " +
                  email
                    .split("@")[0]
                    .split("_")[1]
                    .toUpperCase(),
              }

              console.log("Test user authenticated:", user)
              return user
            } catch (error) {
              console.error("Test auth error:", error)
              return null
            }
          },
        }),
      ]
      : []),
  ],
})
