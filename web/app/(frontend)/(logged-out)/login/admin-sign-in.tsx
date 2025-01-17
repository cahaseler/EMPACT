"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function AdminSignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn("admin-credentials", {
          email,
          password,
          redirect: true,
          redirectTo: "/",
        }).then((res: any) => {
          console.log(res)
          if (res?.error) {
            setError(res.error)
          }
        })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="w-auto">
          <CardHeader className="p-4">
            <div className="mb-4">
              <CardTitle className="max-sm:text-center">
                Sign In
              </CardTitle>
            </div>
            <div className="flex flex-col space-y-4 items-center">
              <div className="w-full flex flex-col space-y-2">
                <label
                  htmlFor="email"
                  className="block font-medium"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 px-4 border border-indigo-100 dark:border-indigo-900"
                />
              </div>
              <div className="w-full flex flex-col space-y-2">
                <label
                  htmlFor="password"
                  className="block font-medium"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-2 px-4 border border-indigo-100 dark:border-indigo-900"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
                Sign in
              </Button>
              {error !== "" && 
                <div className="text-sm text-description text-red-500">
                  {error}
                </div>
              }
              <div className="text-sm text-description">
                Since you haven't yet configured your installation, you'll need to sign in with your admin credentials. You should have set up your admin username and password in your environment configuration. Use these to log in, and we can configure some other authentication providers.
              </div>
            </div>
          </CardHeader>
        </Card>
    </form>
  )
}
