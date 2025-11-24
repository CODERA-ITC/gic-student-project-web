import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    isInitialized: false,
    isTransitioning: false,
  }),

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
  },

  actions: {
    initialize() {
      if (this.isInitialized) return
      
      if (process.client) {
        // Prevent flash of wrong theme by adding no-transition class
        document.documentElement.classList.add('no-transition')
        
        // Check localStorage first
        const stored = localStorage.getItem('theme')
        if (stored) {
          this.isDark = stored === 'dark'
        } else {
          // Fall back to system preference
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        
        this.applyTheme()
        
        // Remove no-transition class after a brief delay
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-transition')
            this.isInitialized = true
          })
        })
      }
    },

    toggle() {
      this.isTransitioning = true
      this.isDark = !this.isDark
      this.applyTheme()
      this.saveToStorage()
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        this.isTransitioning = false
      }, 300)
    },

    setTheme(theme: 'dark' | 'light') {
      if (this.currentTheme === theme) return
      
      this.isTransitioning = true
      this.isDark = theme === 'dark'
      this.applyTheme()
      this.saveToStorage()
      
      setTimeout(() => {
        this.isTransitioning = false
      }, 300)
    },

    applyTheme() {
      if (process.client) {
        const html = document.documentElement
        
        if (this.isDark) {
          html.classList.add('dark')
          html.style.colorScheme = 'dark'
        } else {
          html.classList.remove('dark')
          html.style.colorScheme = 'light'
        }
      }
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('theme', this.currentTheme)
      }
    },
  },
})