import type { PluginAPI } from "tailwindcss/types/config";

module.exports = ({ addUtilities }: PluginAPI) => {
  const basicUtilities: Record<string, any> = {
    // set to parallex scroll element's parent for setting background to child
    ".page-link": {
      "@apply text-base hover:text-primary-hover motion-safe:transition-colors motion-safe:duration-300": {},
    },
  };
  addUtilities(basicUtilities);
};
