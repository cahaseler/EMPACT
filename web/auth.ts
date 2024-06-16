import type { User } from "next-auth"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Needed when hosted in Docker or behind a Reverse Proxy
  debug: process.env.AUTH_DEBUG === "true", // Enable debug logging - change the value in your environment variables
  providers: [
    /* The credentials provider is only used for the Admin user on first login so they can configure the secure login options to use in the future.
    * Using credential based authentication is likely a bad idea in most security contexts due to lack of multifactor authentication.
     This application is written to make it easy to set up a variety of Single Sign On (SSO) providers or to use 'Magic Links' for temporary non-priviliged users.
    
    * If you do *really really* want to use credential based authentication, you'll need to rewrite this with security in mind.
    * You can start that here: https://authjs.dev/getting-started/authentication/credentials
    * But don't.
    */
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        if (
          credentials.password == process.env.SETUP_ADMIN_PASSWORD &&
          credentials.email == "admin"
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
  ],
})
