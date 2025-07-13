import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				codetrail: {
					blue: 'hsl(var(--codetrail-blue))',
					purple: 'hsl(var(--codetrail-purple))',
					green: 'hsl(var(--codetrail-green))',
					orange: 'hsl(var(--codetrail-orange))',
					red: 'hsl(var(--codetrail-red))'
				},
				custom: {
					dark: 'hsl(var(--custom-dark))', /* #202226 equivalent */
					light: 'hsl(var(--custom-light))', /* #F1F0EF equivalent */
					muted: 'hsl(var(--custom-muted))' /* #949CA0 equivalent */
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				hacker: {
					black: 'hsl(var(--hacker-black))',
					green: 'hsl(var(--hacker-green))',
					'green-bright': 'hsl(var(--hacker-green-bright))',
					'green-dark': 'hsl(var(--hacker-green-dark))',
					'green-muted': 'hsl(var(--hacker-green-muted))',
					success: 'hsl(var(--hacker-success))',
					warning: 'hsl(var(--hacker-warning))'
				},
				'neon-green': 'hsl(var(--neon-green))',
				tech: {
					'primary-green': 'hsl(var(--hacker-green))', // Dynamic green
					'accent-green': 'hsl(var(--hacker-green-bright))', // Dynamic bright green
					'dark-green': 'hsl(var(--hacker-green-dark))', // Dynamic dark green
					'deep-black': 'hsl(var(--hacker-black))', // Dynamic black/dark
					'tech-gray': 'hsl(var(--muted-foreground))', // Dynamic gray for text
					'tech-border': 'hsl(var(--border))', // Dynamic border
					'tech-glow': 'hsl(var(--hacker-green))', // Dynamic glow color
				}
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, hsl(0, 0%, 4%) 0%, hsl(120, 100%, 8%) 50%, hsl(0, 0%, 4%) 100%)',
				'gradient-secondary': 'linear-gradient(135deg, hsl(120, 100%, 8%) 0%, hsl(0, 0%, 4%) 100%)',
				'gradient-hero': 'linear-gradient(135deg, hsl(0, 0%, 4%) 0%, hsl(120, 100%, 6%) 25%, hsl(0, 0%, 4%) 100%)',
				'gradient-card': 'linear-gradient(135deg, hsl(0, 0%, 6%) 0%, hsl(120, 100%, 10%) 100%)'
			},
			boxShadow: {
				'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 20px rgba(0, 255, 0, 0.4)',
				'glow-primary': '0 0 30px rgba(0, 255, 0, 0.5), 0 0 60px rgba(0, 255, 0, 0.2)',
				'glow-subtle': '0 0 15px rgba(0, 255, 0, 0.3)',
				'tech-card': '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 0, 0.1)',
				'tech-card-hover': '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 255, 0, 0.3)'
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
				'brand': ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			},
			borderRadius: {
				lg: '0.75rem',
				md: '0.5rem',
				sm: '0.375rem',
				'tech': '0.75rem'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(0, 255, 0, 0.6)' }
				},
				'animate-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), 0 0 40px rgba(0, 255, 0, 0.2)',
						opacity: '1'
					},
					'50%': { 
						boxShadow: '0 0 30px rgba(0, 255, 0, 0.6), 0 0 60px rgba(0, 255, 0, 0.3)',
						opacity: '0.9'
					}
				},
				'tech-glow': {
					'0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 10px rgba(0, 255, 0, 0.3))' },
					'50%': { filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(0, 255, 0, 0.5))' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'floating': 'floating 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'animate-float': 'animate-float 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'tech-glow': 'tech-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate, typography],
} satisfies Config;