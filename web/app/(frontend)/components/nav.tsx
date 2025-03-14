"use client"

import { cn } from "@/lib/utils"

import { AssessmentType } from "@/prisma/mssql/generated/client"

import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu"

import { 
  NotebookPen,
  FileChartColumn,
  Users,
  BookCopy,
  Settings, 
  UserCog, 
  LogOut, 
  Menu 
} from "lucide-react"

import Link from "next/link"

import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

/*

TODO: Build out the navigation menu

Lots of work to be done here to link to key sections of the application, and provide menus for things like admin functions when relevant based on user role

*/

export function Nav({ 
  assessmentType, 
  name,
  isAdmin,
  canViewUsers 
}: Readonly<{ 
  assessmentType?: AssessmentType, 
  name?: string,
  isAdmin?: boolean,
  canViewUsers?: boolean 
}>) {
  const pn = usePathname()
  return (
    <NavigationMenu
      className={
        "bg-indigo-800 border-indigo-800 min-w-full min-h-12 flex-wrap text-indigo-200 justify-between"
      }
    >
      <NavigationView>
        <NavigationMenuList className="md:py-0.5 flex flex-col md:flex-row md:space-x-6 max-md:space-y-4 max-md:mb-4 justify-start">
          <NavigationMenuItem className="max-md:hidden ml-5 font-bold font-sans text-3xl list-none w-fit">
            <Link href="/" legacyBehavior>EMPACT</Link>
          </NavigationMenuItem>
          {assessmentType &&
            <>
              <NavigationMenuItem className="mr-5 md:mt-0.5 font-bold font-sans text-lg list-none w-fit">
                <Link href={"/" + assessmentType.id} legacyBehavior>{assessmentType.name}</Link>
              </NavigationMenuItem>
              <NavigationMenuList className="flex-wrap flex-col md:flex-row md:space-x-6 max-md:space-y-4 max-md:mb-4 md:mt-1">
                <NavigationItemLink
                  href={"/" + assessmentType.id + "/assessments"}
                  label="Assessments"
                  icon={<NotebookPen className="w-5 h-5" />}
                />
                {/* TODO Add reports page */}
                <NavigationItemLink
                  href={"/" + assessmentType.id + "/reports"}
                  label="Reports"
                  icon={<FileChartColumn className="w-5 h-5" />}
                />
                {/* TODO Add users page */}
                {canViewUsers && <NavigationItemLink
                  href={"/" + assessmentType.id + "/users"}
                  label="Users"
                  icon={<Users className="w-5 h-5" />}
                />}
                {/* TODO Add resources page */}
                <NavigationItemLink
                  href={"/" + assessmentType.id + "/resources"}
                  label="Resources"
                  icon={<BookCopy className="w-5 h-5" />}
                />
              </NavigationMenuList>
            </>
          }
        </NavigationMenuList>
        <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-4 max-md:space-y-4 md:mx-4 max-md:mb-4 justify-end">
          {!pn.includes("login") &&
          <>
            <NavigationMenuItem>
              {name && <div className="flex flex-row space-x-1 items-center">{name}</div>}
            </NavigationMenuItem>
            <NavigationItemLink
              href="/settings"
              label="Settings"
              icon={<Settings className="w-5 h-5" />}
            />
            {isAdmin && 
              <NavigationItemLink
                href="/admin"
                label="Admin"
                icon={<UserCog className="w-5 h-5" />}
              />
            }
            <NavigationMenuItem onClick={() => signOut()}>
              <NavigationMenuLink
                className="md:bg-indigo-800 md:border-indigo-800 hover:font-bold flex flex-row space-x-1 items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <div>Sign Out</div>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
          }
          <ModeToggle />
        </NavigationMenuList>
      </NavigationView>
    </NavigationMenu>
  )
}

function NavigationView({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full items-center">
      <div className="max-md:hidden flex flex-row justify-between w-full">
        {children}
      </div>
      <div className="md:hidden flex flex-row justify-between w-full items-center">
        <NavigationMenuItem className="mx-5 font-bold font-sans text-3xl list-none w-fit">
          <Link href="/" legacyBehavior>EMPACT</Link>
        </NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="mx-5">
            <Menu className="w-7 h-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function NavigationItemLink({
  href,
  label,
  icon,
}: {
  readonly href: string
  readonly label: string
  readonly icon?: React.ReactNode
}) {
  const pn = usePathname()

  const linkStyle = 
    "md:bg-indigo-800 md:border-indigo-800 hover:font-bold flex flex-row space-x-1 items-center"
  

  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(href === pn ? "font-bold" : "", linkStyle)}
        >
          {icon}
          <div>{label}</div>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}
