export default defineNuxtRouteMiddleware(async (to) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await getCurrentUser()
  if (!user) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } })
  }
})
