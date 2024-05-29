"use client"

import { cn } from "@/lib/utils"

import { ModeToggle } from "@/components/ui/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { Building2, Folder, ListChecks, Settings } from "lucide-react"

import Link from "next/link"

import { colors, productName } from "@/app/(frontend)/branding"
import { usePathname } from "next/navigation"

export function Nav() {
  return (
    <NavigationMenu
      className={cn(
        colors["nav-bg"],
        colors["nav-text"],
        "min-w-full h-12 justify-between"
      )}
    >
      <NavigationMenuList className="pt-1 flex flex-row space-x-6">
        <NavigationMenuItem className="mx-5 font-bold font-sans text-3xl">
          {productName}
        </NavigationMenuItem>
        <NavigationItemLink
          href="/Sites"
          label="Sites"
          icon={<Building2 className="w-5 h-5" />}
        />
        <NavigationItemLink
          href="/Projects"
          label="Projects"
          icon={<Folder className="w-5 h-5" />}
        />
        <NavigationItemLink
          href="/Assessments"
          label="Assessments"
          icon={<ListChecks className="w-5 h-5" />}
        />
      </NavigationMenuList>
      <NavigationMenuList className="py-1 flex flex-row space-x-4 mr-4">
        <NavigationItemLink
          href="/Settings"
          label="Settings"
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

  const linkStyle = cn(
    colors["nav-bg"],
    colors["nav-text"],
    "hover:font-bold flex flex-row space-x-1"
  )

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
