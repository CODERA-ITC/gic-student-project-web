export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()

    // Restore authentication from stored token on app initialization
    if (process.client) {
        await authStore.restoreAuth()
    }
})
