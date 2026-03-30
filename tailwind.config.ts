import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'iungo': {
          'navy': '#0F172A',        // Slate 900 - azul escuro moderno
          'dark-navy': '#020617',   // Slate 950 - ainda mais escuro
          'light-navy': '#1E293B',  // Slate 800 - azul médio
          'gray': '#64748B',        // Slate 500 - cinza equilibrado
          'light-gray': '#F8FAFC',  // Slate 50 - cinza muito claro
          'dark-gray': '#475569',   // Slate 600 - cinza escuro
          'accent': '#3B82F6',      // Blue 500 - azul vibrante moderno
          'primary': '#6366F1',     // Indigo 500 - roxo-azul moderno
          'secondary': '#10B981',   // Emerald 500 - verde moderno
          'tertiary': '#F59E0B',    // Amber 500 - laranja moderno
          'success': '#059669',     // Emerald 600 - verde sucesso
          'warning': '#D97706',     // Amber 600 - laranja aviso
          'error': '#DC2626',       // Red 600 - vermelho erro
          'purple': '#8B5CF6',      // Violet 500 - roxo moderno
          'pink': '#EC4899',        // Pink 500 - rosa moderno
          'teal': '#14B8A6',        // Teal 500 - verde-azul moderno
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'logo': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      }
    },
  },
  plugins: [],
}

export default config
