"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function TestAuthPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") ?? "/"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn("test-credentials", {
            email,
            password,
            callbackUrl,
            redirect: true,
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Test Authentication</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This page is only available during testing
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium"
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
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium"
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
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    )
}
