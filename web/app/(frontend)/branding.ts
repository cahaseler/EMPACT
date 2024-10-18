/**
 *
 * Customize colors in this file for use across the site, choosing between Tailwind CSS colors by default.
 * See this page for a list of colors to choose from: https://tailwindcss.com/docs/customizing-colors
 *
 * Remember to specify both light and dark versions for each color.
 *
 * Alternatively, create custom colors to match your brand in tailwind.config.ts and then use those new colors here.
 * See https://tailwindcss.com/docs/customizing-colors#customizing
 *
 * Remember to make the change in both the web and web_static directories.
 *
 */

export const colors = {
  "nav-bg": "bg-zinc-400 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-800", // Background color of the navbar. Maybe your brand color, or something complementary?
  "nav-text": "text-zinc-800 dark:text-zinc-200", // Text color of the navbar. Make this contrast a lot with nav-bg
  background: "bg-zinc-50 dark:bg-zinc-950", // Background color of the page. Pick something almost white and almost black for these unless you hate your users
}

// Go ahead and customize these - rename it, rebrand it, make it your own. Please note that if you do change these values, the footer will also include a statement and link to the original EMPACT Open Source project. Providing a link to the original project is essentially the one thing that the CC BY 4.0 license requires, so don't change that!

//The version number in the footer comes from /components/version-indicator.tsx. For the original project by cahaseler, that value gets updated by a script duirng deployment.

export const productName = "EMPACT"

export const customFooter = {
  links: [
    {
      name: "About",
      url: "https://github.com/cahaseler/EMPACT",
    },
  ],
  copyright: `© ${new Date().getFullYear()} EMPACT. Licensed under CC BY 4.0`,
}
