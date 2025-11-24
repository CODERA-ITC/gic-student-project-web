export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore()
  
  // Initialize theme immediately
  themeStore.initialize()
  
  // Listen for system theme changes
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme) {
        themeStore.setTheme(e.matches ? 'dark' : 'light')
      }
    }
    
    // Use the appropriate listener method
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }
  }
})