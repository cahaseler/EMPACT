import type { Config } from 'tailwindcss';

// This is the base Tailwind configuration.
// Workspace-specific configurations (like web/) should import and extend this.
const config: Config = {
  content: [
    // Shared content paths can be defined here if necessary,
    // but typically workspace configs handle their own content paths.
    // e.g., './packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Define shared theme extensions here if needed across workspaces.
      // Example:
      // colors: {
      //   brand: '#123456',
      // },
    },
  },
  plugins: [
    // Add shared plugins here if needed.
    // Example: require('@tailwindcss/forms'),
  ],
};

export default config;