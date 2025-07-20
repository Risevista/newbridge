import type { PluginAPI } from "tailwindcss/types/config";

module.exports = ({ addUtilities, matchUtilities, theme, e }: PluginAPI) => {
  const perspectives = [] as unknown as Record<string, string>;
  const basicUtilities: Record<string, any> = {
    // set to parallex scroll element's parent for setting background to child
    ".scroll-parent": {
      "@apply relative m-auto overflow-x-hidden bg-transparent *:bg-primary-back": {},
    },
    ".fixed-overlay": {
      "@apply fixed top-0 left-0 w-full h-dvh bg-primary justify-center items-center":
        {},
    },
    /* ----- animating header link a tag components
        --line-color: color for border",
        --color-after: color for border after transition",
        --background-color: background color for eliminating border at the beginning",
        --x-line-duration: duration for rendering horizontal border",
        --y-line-duration: duration for rendering vertical border",
    */
    ".animated-header-links": { 
      "@apply gap-4 list-none": {},
      "& a": {
        position: "relative",
        padding: "4px 8px",
        "@media (prefers-reduced-motion: no-preference)": {
          transition: "color calc(var(--y-line-duration) * 2)",
        },
        "&::before": {
          "@apply absolute top-1/2 left-0 h-0 w-0 opacity-0 box-border": {},
          content: '""',
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderLeft: "1px solid",
          borderRight: "0px solid",
          borderColor: 'var(--line-after)',
          "@media (prefers-reduced-motion: no-preference)": {
            transition: `width var(--x-line-duration) linear var(--y-line-duration),
                    height var(--y-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration)),
                    top var(--y-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration)),
                    border-color calc(var(--y-line-duration) * 2) linear,
                    border-right 0s var(--y-line-duration),
                    opacity 0s calc(var(--x-line-duration) + var(--y-line-duration) * 2)`,
          },
        },
        "&::after": {
          "@apply absolute top-0 bottom-0 right-0 w-px": {},
          content: '""',
          backgroundColor: "transparent",
          "@media (prefers-reduced-motion: no-preference)": {
            transition: `top var(--y-line-duration) linear,
              bottom var(--y-line-duration) linear,
              background-color 0s var(--y-line-duration)`,
          },
        },
        "&:hover": {
          color: "var(--color-after)",
          "@media (prefers-reduced-motion: no-preference)": {
            transition:
            "color calc(var(--y-line-duration) * 2) ease var(--x-line-duration)",
          },
        },
        '&:hover::before': {
          '@apply opacity-100 w-full h-full top-0': {},
          borderRight: "1px solid",
          borderColor: 'var(--color-after)',
          "@media (prefers-reduced-motion: no-preference)": {
            transition:
            `width var(--x-line-duration) linear var(--y-line-duration),
            height var(--y-line-duration) linear,
            top var(--y-line-duration) linear,
            border-color calc(var(--y-line-duration) * 2) linear var(--x-line-duration),
            border-right 0s calc(var(--x-line-duration) + var(--y-line-duration))`,
          },
        },
        '&:hover::after': {
          '@apply top-1/2 bottom-1/2': {},
          backgroundColor: "var(--background-color)",
          "@media (prefers-reduced-motion: no-preference)": {
            transition: `top var(--y-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration)),
            bottom var(--y-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration))`,
          },
        }
      },
    },

    /* animating-frame for animating frame.  Set class animating frame to image's parent element like div. */
    ".frame-animation .animating-frame": {
      "--line-color": "theme('colors.secondary.accent')",
      "--background-color": "theme('colors.primary.back')",
      "--x-line-duration": "0.25s",
      "--y-line-duration": "0.25s",
      color: "var(--line-color)",
      overflow: "hidden",
  
      "& span": {
        position: "absolute",
        top: "calc(50% - 1.5rem)",
        left: "calc(50% - 1.5rem)",
        textAlign: "center",
        width: "3rem",
        height: "3rem",
        fontSize: "3rem",
        lineHeight: "2rem",
        padding: "0.5rem",
        backgroundColor: "var(--background-color)",
        opacity: 0,
        transform: "scale(0)",
      },
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        height: 0,
        width: 0,
        opacity: 0,
        boxSizing: "border-box",
        zIndex: 40,
      },
      "&::before": {
        top: "5%",
      left: "5%",
      borderTop: "2px solid var(--line-color)",
      borderRight: "2px solid var(--line-color)",
      },
      "&::after": {
        bottom: "5%",
        right: "5%",
        borderBottom: "2px solid var(--line-color)",
        borderLeft: "2px solid var(--line-color)",
      },
      "@media (prefers-reduced-motion: no-preference)": {
        "& span": {
          transition: "all 1s ease-in-out",
        },
        "& img": {
          transition: "all 0.6s ease-in-out",
        },
        "&::before": {
          transition:
          `width var(--x-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration) * 2),
          height var(--y-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration)),
          opacity 0s calc(var(--x-line-duration) * 2 + var(--y-line-duration) * 2)`,
        },
        "&::after": {
          transition:
          `width var(--x-line-duration) linear var(--y-line-duration),
          height var(--y-line-duration) linear,
          opacity 0s calc(var(--x-line-duration) + var(--y-line-duration))`,
        },
      },
    },
    ".frame-animation:hover .animating-frame" : {
      "& span": {
        transform: "scale(1)",
        opacity: 0.5,
      },
    
      "& img": {
          transform: "scale(1.05)",
          backgroundColor: "var(--background-color)",
          opacity: 0.8,
      },
      "&::before, &::after": {
          opacity: 1,
          width: "90%",
          height: "90%",
      },
      "@media (prefers-reduced-motion: no-preference)": {
          "&::before": {
            transition:
                `width var(--x-line-duration) linear,
                height var(--y-line-duration) linear var(--x-line-duration)`,
        },
        
        "&::after": {
          transition:
                `width var(--x-line-duration) linear calc(var(--x-line-duration) + var(--y-line-duration)),
                height var(--y-line-duration) linear calc(var(--x-line-duration) * 2 + var(--y-line-duration)),
                opacity 0s calc(var(--x-line-duration) + var(--y-line-duration))`,
        },
      },
    },

    /* slide-in for letter sliding in. Set .letter-effect to scroll-trigger's direct child or implement to add class open when fire.  Top, bottom, left, right is effective. */
    ".slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom": {
      position: "relative",
      opacity: 0,
    },
    ".letter-effect.open" : {
      '& .slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom': {
        top: 0,
        left: 0,
        opacity: 1,
        transform: "skewX(0)",
      }
    },
    ".slide-in-top": {
        top: "-40px",
    },
    ".slide-in-bottom": {
        top: "40px",
    },
    ".slide-in-left": {
        left: "60px",
        transform: "skewX(5deg)",
        opacity: 0,
    },
    ".slide-in-right": {
        left: "60px",
        transform: "skewX(5deg)",
        opacity: 0,
    },
    ".scroll-trigger.open": {
        left: 0,
        opacity: 1,
        transform: "skewX(0)",
    },
    "@media (prefers-reduced-motion: no-preference)": {
      ".slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom": {
        transition: "all 1.2s cubic-bezier(0,0,0.28,0.88)",
      },
      ".slide-in-right": {
          transition: "opacity 1s ease-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), left 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  };
  const utilities = Object.keys(perspectives).reduce((acc, key) => {
    acc[`.${e(`perspective-${key}`)}`] = {
      perspective: perspectives[key],
    };
    return acc;
  }, basicUtilities);
  addUtilities(utilities);
  matchUtilities(
    {
      perspective: (value) => ({
        perspective: `${value}dvh`,
      }),
    },
    { values: theme("perspective") }
  );
};
