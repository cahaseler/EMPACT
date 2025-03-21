import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"

type link = {
  url: string
  name: string
}

export default function Breadcrumbs({
  links,
  currentPage,
}: {
  readonly links: link[]
  readonly currentPage: string
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:mt-[-25px]">
        {links.map((link: link) => {
          return (
            <Fragment key={link.url}>
              <BreadcrumbItem>
                <BreadcrumbLink href={link.url}>{link.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          )
        })}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
