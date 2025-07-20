/** @type {import('tailwindcss').Config} */
const basePlugin = require('./plugin/basestyle');
const animationPlugin = require('./plugin/animation');
const colors = require('tailwindcss/colors')


export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		perspective: {
			'10': '10'
		},
		extend: {
  fontFamily: {
    notojp: ['"Noto Serif JP"', 'serif'],
    cormorant: ['"Cormorant Garamond"', 'serif'],
    serif: ['"Cormorant Garamond"', 'serif'],
  },
  fontWeight: {
    DEFAULT: '300',
  },
  colors: {
    primary: {
      DEFAULT: colors.white,
      hover: colors.gray[400],
      back: colors.black,
    },
    secondary: {
      DEFAULT: "#BF9E63",
      accent: colors.red[500],
      screen: "#441414",
    },
  },
			screens: {
				'2lg': '1096px'
			},
			zIndex: {
				'1': '1',
				'99': '99',
				'max': '9999'
			},
			transitionDuration: {
				'DEFAULT': '1s'
			},
			boxShadow: {
				'squarewhite-2': '0 0 0.2rem 0.2rem rgba(255, 255, 255, 0.5)',
				'squarewhite-3': '0 0 0.3rem 0.3rem rgba(255, 255, 255, 0.8)',
				'squarewhite-4': '0 0 0.4rem 0.4rem rgba(255, 255, 255, 0.9)',
			},
			keyframes: {
				'slide-in-left': {
					'0%': { transform: 'translateX(-60px) skewX(-5deg)', opacity: '0' },
					'100%': { transform: 'translateX(0) skewX(0)', opacity: '1' }
				}
			},
			animation: {
				'slide-in-left': 'slide-in-left 0.8s ease-out forwards'
			}
		},
	},
	plugins: [basePlugin, animationPlugin],
}
