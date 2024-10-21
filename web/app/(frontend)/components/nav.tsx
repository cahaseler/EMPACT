"use client"

import { cn } from "@/lib/utils"

import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { Settings } from "lucide-react"

import Link from "next/link"

import { usePathname } from "next/navigation"

/*

TODO: Build out the navigation menu

Lots of work to be done here to link to key sections of the application, and provide menus for things like admin functions when relevant based on user role

*/

export function Nav() {
  return (
    <NavigationMenu
      className={
        "bg-zinc-400 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-800 min-w-full h-12 justify-between text-zinc-800 dark:text-zinc-200"
      }
    >
      <NavigationMenuList className="pt-1 flex flex-row space-x-6">
        <NavigationMenuItem className="mx-5 font-bold font-sans text-3xl">
          EMPACT
        </NavigationMenuItem>
        {/* TODO Add more links */}
      </NavigationMenuList>
      <NavigationMenuList className="py-1 flex flex-row space-x-4 mr-4">
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
        <ModeToggle />
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavigationItemLink({
  href,
  label,
  icon,
}: {
  readonly href: string
  readonly label: string
  readonly icon: React.ReactNode
}) {
  const pn = usePathname()

  const linkStyle = 
    "bg-zinc-400 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-800 hover:font-bold flex flex-row space-x-1"
  

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
