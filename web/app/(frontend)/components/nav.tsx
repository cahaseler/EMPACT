"use client"

import { SignedIn, UserButton } from "@clerk/nextjs"
import {
  BookCopy,
  FileChartColumn,
  Menu,
  Moon,
  NotebookPen,
  Settings,
  ShieldUser,
  Sun,
  User,
  UserCog,
  Users,
  Wrench,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { AssessmentType } from "@/prisma/mssql/generated/client"

/*

TODO: Build out the navigation menu

Lots of work to be done here to link to key sections of the application, and provide menus for things like admin functions when relevant based on user role

*/

export function Nav({
  assessmentType,
  name,
  isAdmin,
  canViewUsers,
}: Readonly<{
  assessmentType?: AssessmentType
  name?: string
  isAdmin?: boolean
  canViewUsers?: boolean
}>) {
  const { theme, setTheme } = useTheme()

  // Function to toggle between light and dark themes
  const cycleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  return (
    <NavigationMenu
      className={
        "bg-indigo-800 border-indigo-800 min-w-full min-h-12 flex-wrap text-indigo-200 justify-between"
      }
    >
      <NavigationView>
        <NavigationMenuList className="md:py-0.5 flex flex-col md:flex-row md:space-x-6 max-md:space-y-4 max-md:mb-4 justify-start">
          <NavigationMenuItem className="max-md:hidden ml-5 font-bold font-sans text-3xl list-none w-fit">
            <Link href="/" legacyBehavior>
              EMPACT
            </Link>
          </NavigationMenuItem>
          {assessmentType && (
            <>
              <NavigationMenuItem className="mr-5 md:mt-0.5 font-bold font-sans text-lg list-none w-fit">
                <Link href={"/" + assessmentType.id} legacyBehavior>
                  {assessmentType.name}
                </Link>
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
                {canViewUsers && (
                  <NavigationItemLink
                    href={"/" + assessmentType.id + "/users"}
                    label="Users"
                    icon={<Users className="w-5 h-5" />}
                  />
                )}
                {/* TODO Add resources page */}
                <NavigationItemLink
                  href={"/" + assessmentType.id + "/resources"}
                  label="Resources"
                  icon={<BookCopy className="w-5 h-5" />}
                />
              </NavigationMenuList>
            </>
          )}
        </NavigationMenuList>
        <NavigationMenuList className="md:py-1 flex flex-col md:flex-row flex-wrap md:space-x-4 max-md:space-y-4 md:mx-4 max-md:mb-4 justify-end">
          <UserButton
            showName
            appearance={{
              elements: { userButtonOuterIdentifier: "text-white" },
            }}
          >
            {isAdmin && (
              <UserButton.MenuItems>
                <UserButton.Link
                  href={"/admin"}
                  labelIcon={<ShieldUser className="w-5 h-5" />}
                  label="Manage Admin Users"
                />
                <UserButton.Link
                  href={
                    "https://dashboard.clerk.com/apps/app_2uY5YuVmY57Q8zjRsnJROlNQfJ1/instances/ins_2uY5Ys3asJCsfUdZZVsaNe6IR2a"
                  }
                  labelIcon={<Wrench className="w-5 h-5" />}
                  label="Clerk Dashboard"
                />
              </UserButton.MenuItems>
            )}
            <UserButton.MenuItems>
              <UserButton.Action
                label={theme === "light" ? "Dark Mode" : "Light Mode"}
                labelIcon={
                  theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )
                }
                onClick={() => {
                  // Stop event propagation to prevent menu closing
                  setTimeout(() => {
                    cycleTheme()
                  }, 0)
                  return false
                }}
              />
            </UserButton.MenuItems>
          </UserButton>
        </NavigationMenuList>
      </NavigationView>
    </NavigationMenu>
  )
}

function NavigationView({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="w-full items-center">
      <div className="max-md:hidden flex flex-row justify-between w-full">
        {children}
      </div>
      <div className="md:hidden flex flex-row justify-between w-full items-center">
        <NavigationMenuItem className="mx-5 font-bold font-sans text-3xl list-none w-fit">
          <Link href="/" legacyBehavior>
            EMPACT
          </Link>
        </NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="mx-5">
            <Menu className="w-7 h-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>{children}</DropdownMenuContent>
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
