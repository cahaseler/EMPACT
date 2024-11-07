import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb"

  type links = Array<{url: string, name: string}>

  export default function Breadcrumbs({
    links, 
    currentPage
  }: {
    readonly links: links,
    readonly currentPage: string
  }) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
            {links.map((link) => {
                return (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={link.url}>{link.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    </>
                )
            }
            )}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> 
    )
  }