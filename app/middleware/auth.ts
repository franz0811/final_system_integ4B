export default defineNuxtRouteMiddleware((to, from) => {
  const authToken = useCookie('google_auth_token')

  // Kung walang token at sinusubukang pumasok sa dashboard, punta sa login
  if (!authToken.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})