import { customFooter } from "../../branding"

export function Footer() {
  return (
    <footer className="bg-white h-10 border-t">
      <div className="static inset-x-0 bottom-0 z-20 flex flex-row justify-evenly align-middle mt-2 text-xs">
        <div>
          {customFooter.links.map((l) => (
            <a key={l.url} href={l.url}>
              {l.name}
            </a>
          ))}
        </div>
        <div>{customFooter.copyright}</div>
      </div>
    </footer>
  )
}
