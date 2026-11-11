export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = useCookie('google_auth_token').value

  // Kung HINDI naka-login at ang pinupuntahan ay HINDI /login, ibalik sa /login
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
})