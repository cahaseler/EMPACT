import { cn } from "@/lib/utils"

export default function Success() {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8")}>
      <h1 className="text-3xl font-bold tracking-tighter">
        Thank you for registering for EMPACT
      </h1>
      <p className="text-base text-muted-foreground dark:text-indigo-300/80 md:text-lg/relaxed lg:text-sm/relaxed xl:text-base/relaxed max-w-prose mx-auto mt-4 mb-8">
        {`You will soon receive access to your assessments. If you're expecting to
        see an assessment and don't see it, please reach out to your assessment
        facilitator.`}
      </p>
    </div>
  )
}
