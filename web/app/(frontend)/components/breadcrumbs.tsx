import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb"

  type link = {
    url: string,
    name: string
  }

  export default function Breadcrumbs({
    links, 
    currentPage
  }: {
    readonly links: link[],
    readonly currentPage: string
  }) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
            {links.map((link: link) => {
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