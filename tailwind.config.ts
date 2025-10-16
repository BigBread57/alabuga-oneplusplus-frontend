import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#00aeef', // Основной голубой
          dark: '#005dac', // Тёмно-синий
          light: '#6acff6', // Светлый голубой
          deep: '#283a97', // Глубокий синий
        },
        // Космические цвета
        cosmic: {
          black: '#0a0e27',
          navy: '#0f1629',
          void: '#1a1f3a',
          deep: '#16213e',

          neon: {
            purple: '#c41e3a',
            cyan: '#00d9ff',
            pink: '#ff006e',
            green: '#00ff88',
            blue: '#0099ff',
          },

          primary: '#6366f1',
          secondary: '#ec4899',
          accent: '#06b6d4',

          muted: '#4f46e5',
          border: '#2d3748',
          surface: '#1e293b',
        },
      },

      backgroundColor: {
        cosmic: 'var(--bg-cosmic)',
        gradient:
          'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #0f1629 100%)',
      },

      backgroundImage: {
        // Космические градиенты
        'cosmic-gradient':
          'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #0f1629 100%)',
        'neon-gradient':
          'linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%)',
        'aurora':
          'linear-gradient(180deg, #0a0e27 0%, #6366f1 25%, #0f1629 50%, #ec4899 75%, #0a0e27 100%)',
        'stars': `radial-gradient(2px 2px at 20px 30px, white, rgba(255, 255, 255, 0)),
                  radial-gradient(2px 2px at 60px 70px, white, rgba(255, 255, 255, 0)),
                  radial-gradient(1px 1px at 50px 50px, white, rgba(255, 255, 255, 0)),
                  radial-gradient(1px 1px at 130px 80px, white, rgba(255, 255, 255, 0)),
                  radial-gradient(2px 2px at 90px 10px, white, rgba(255, 255, 255, 0))`,
      },

      boxShadow: {
        // Неоновые свечения
        'neon-purple':
          '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)',
        'neon-cyan':
          '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
        'neon-pink':
          '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
        'neon-green':
          '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',

        // Интенсивные свечения
        'glow-purple':
          '0 0 10px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.6), inset 0 0 10px rgba(99, 102, 241, 0.2)',
        'glow-cyan':
          '0 0 10px rgba(0, 217, 255, 0.8), 0 0 30px rgba(0, 217, 255, 0.6), inset 0 0 10px rgba(0, 217, 255, 0.2)',

        // Мягкие тени
        'cosmic': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      },

      textColor: {
        cosmic: {
          primary: '#ffffff',
          secondary: '#d1d5db',
          muted: '#9ca3af',
          accent: '#00d9ff',
        },
      },

      borderColor: {
        cosmic: {
          light: 'rgba(99, 102, 241, 0.2)',
          medium: 'rgba(99, 102, 241, 0.5)',
          strong: 'rgba(99, 102, 241, 0.8)',
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'orbit': {
          '0%': {
            transform: 'rotate(0deg) translateX(50px) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateX(50px) rotate(-360deg)',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
        'flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: '1',
          },
          '20%, 24%, 55%': {
            opacity: '0.5',
          },
        },
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },

      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-smooth': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },

  plugins: [
    // Плагин для glassmorphism эффекта
    function ({ addUtilities }: any) {
      addUtilities({
        '.glass': {
          '@apply backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg':
            {},
        },
        '.glass-dark': {
          '@apply backdrop-blur-xl bg-black/30 border border-white/10 rounded-lg':
            {},
        },
        '.glass-purple': {
          '@apply backdrop-blur-xl bg-indigo-500/10 border border-indigo-400/30 rounded-lg':
            {},
        },
        '.neon-border': {
          '@apply border-2 border-transparent bg-clip-padding bg-gradient-to-r from-purple-500 to-pink-500':
            {},
        },
        '.text-glow': {
          '@apply text-white drop-shadow-lg':
            'text-shadow: 0 0 10px rgba(99, 102, 241, 0.8)',
        },
      })
    },
  ],
}

export default config
