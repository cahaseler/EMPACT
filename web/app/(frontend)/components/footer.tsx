import { colors, customFooter, productName } from "@/app/(frontend)/branding"
import { cn } from "@/lib/utils"

export function Footer() {
  return (
    <div className="static inset-x-0 bottom-0 z-20">
      <div
        className={cn(
          colors["nav-bg"],
          colors["nav-text"],
          "w-full h-10 flex justify-center items-center text-xs flex-col"
        )}
      >
        <div className="flex flex-row space-x-20">
          <div>{productName}</div>
          <div>{" | "}</div>
          {customFooter.links.map((l) => (
            <>
              <div key={l.url} className="flex flex-row">
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.name}
                </a>
              </div>
              <div>{" | "}</div>
            </>
          ))}
          <div>{customFooter.copyright}</div>
          {/* Hi future developer - please don't change this! It's about the only thing the license requires. 
          Customize your branding in the branding.ts file. If you do need to change it, please replace it with 
          an equally prominent attribution to the original project. Thanks, and sorry about that one bug.
          --Craig Haseler, May 2024 */}
          {productName !== "EMPACT" && (
            <>
              <div>{" | "}</div>
              <a
                className="underline"
                href="https://github.com/cahaseler/EMPACT"
              >
                {"Based on the the Open Source EMPACT Software"}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
