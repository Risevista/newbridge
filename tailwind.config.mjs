/** @type {import('tailwindcss').Config} */
const basePlugin = require('./plugin/basestyle');
const animationPlugin = require('./plugin/animation');
const colors = require('tailwindcss/colors');

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    perspective: {
      '10': '10',
    },
    extend: {
      fontFamily: {
        tsukushi: ['"tsukushi-b-mincho-pr6n"', 'serif'],
      },
      fontWeight: {
        DEFAULT: '300',
      },
      colors: {
        primary: {
          DEFAULT: "#184C3A",
          hover: colors.gray[400],
          back: colors.black,
        },
        secondary: {
          DEFAULT: "#CEE6C1",
          accent: colors.red[500],
          screen: "#441414",
        },
      },
      lineHeight: {
        comfortable: '1.8',
      },
      screens: {
        '2lg': '1096px',
      },
      zIndex: {
        '1': '1',
        '99': '99',
        'max': '9999',
      },
      transitionDuration: {
        DEFAULT: '1s',
      },
      boxShadow: {
        'squarewhite-2': '0 0 0.2rem 0.2rem rgba(255, 255, 255, 0.5)',
        'squarewhite-3': '0 0 0.3rem 0.3rem rgba(255, 255, 255, 0.8)',
        'squarewhite-4': '0 0 0.4rem 0.4rem rgba(255, 255, 255, 0.9)',
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-60px) skewX(-5deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) skewX(0)', opacity: '1' },
        },
        heroReveal: {
          '0%': {
            transform: 'scale(0.85)',
            filter: 'grayscale(100%) brightness(220%) saturate(0%)',
          },
          '60%': {
            filter: 'grayscale(0%) brightness(100%) saturate(100%)',
          },
          '100%': {
            transform: 'scale(1.08)',
            filter: 'grayscale(0%) brightness(100%) saturate(100%)',
          },
        },
        textDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        textUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scrollLine: {
          '0%': { height: '0px', opacity: '1' },
          '80%': { height: '120px', opacity: '0.5' },
          '100%': { height: '0px', opacity: '0' },
        },
        riseFade: {
          '0%': {
            transform: 'translateY(px)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(60px)',
            opacity: '0',
          },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'hero-reveal': 'heroReveal 1.6s ease-out forwards',
        'text-down': 'textDown 0.8s ease-out 0.2s both',
        'text-up': 'textUp 0.8s ease-out 0.4s both',
        'scroll-line': 'scrollLine 2s infinite',
        'rise-fade': 'riseFade 2s linear infinite',
      },
    },
  },
  plugins: [basePlugin, animationPlugin],
};
