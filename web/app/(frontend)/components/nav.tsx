"use client"

import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import Link from "next/link"

export function Nav() {
  return (
    <NavigationMenu
      className={
        "bg-indigo-800 border-indigo-800 min-w-full min-h-12 flex-wrap text-indigo-200 justify-between"
      }
    >
      <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-6 max-md:space-y-4 max-md:mb-4 justify-start items-center">
        <NavigationMenuItem className="max-md:hidden mx-5 font-bold font-sans text-3xl list-none w-fit">
          <Link href="/login" legacyBehavior>EMPACT</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-4 max-md:space-y-4 md:mx-4 max-md:mb-4 justify-end">
        <ModeToggle />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
