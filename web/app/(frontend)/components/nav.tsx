"use client"

import { cn } from "@/lib/utils"

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

import { Settings, LogOut, Menu } from "lucide-react"

import Link from "next/link"

import { usePathname } from "next/navigation"

/*

TODO: Build out the navigation menu

Lots of work to be done here to link to key sections of the application, and provide menus for things like admin functions when relevant based on user role

*/

export function Nav() {
  const pn = usePathname()
  return (
    <NavigationMenu
      className={
        "bg-indigo-800 border-indigo-800 min-w-full min-h-12 flex-wrap text-indigo-200 justify-between"
      }
    >
      <NavigationView>
        <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-6 max-md:space-y-4 max-md:mb-4 justify-start items-center">
          <NavigationMenuItem className="max-md:hidden mx-5 font-bold font-sans text-3xl list-none w-fit">
            <Link href="/" legacyBehavior>EMPACT</Link>
          </NavigationMenuItem>
          {!Number.isNaN(parseInt(pn.split("/")[1])) && 
          <>
            <NavigationItemLink
              href={"/" + pn.split("/")[1] + "/assessments"}
              label="Assessments"
            />
            {/* TODO Add reports page */}
            <NavigationItemLink
              href={"/" + pn.split("/")[1] + "/reports"}
              label="Reports"
            />
            {/* TODO Add users page */}
            <NavigationItemLink
              href={"/" + pn.split("/")[1] + "/users"}
              label="Users"
            />
            {/* TODO Add resources page */}
            <NavigationItemLink
              href={"/" + pn.split("/")[1] + "/resources"}
              label="Resources"
            />
          </>}
        </NavigationMenuList>
        <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-4 max-md:space-y-4 md:mx-4 max-md:mb-4 justify-end">
          {pn !== "/login" && 
            <>
              <NavigationItemLink
                href="/settings"
                label="Settings"
                icon={<Settings className="w-5 h-5" />}
              />
              <NavigationItemLink
                href="/admin"
                label="Admin"
                icon={<Settings className="w-5 h-5" />}
              />
              {/* TODO Add sign-out functionality */}
              <NavigationItemLink
                href="/login"
                label="Sign Out"
                icon={<LogOut className="w-5 h-5" />}
              />
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
