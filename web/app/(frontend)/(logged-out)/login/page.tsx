import { SignIn } from "./admin-sign-in"

export default async function Page() {
    return (
        <div className="flex h-full flex-col items-center justify-start p-10">
            <SignIn />
        </div>
    )
}