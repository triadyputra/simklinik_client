import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserData = Record<string, any>

export const useUserSession = defineStore('userSession', () => {
  const user = ref<Partial<UserData>>()
  const isLoggedIn = computed(() => user.value !== undefined)

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  function checkPermission(controller: string, action: string) {
    if (!user.value || !user.value.acces) return false
    // console.log(user)
    return user.value.acces.some(
      (perm: { IdController: string, IdAction: string }) =>
        perm.IdController === controller && perm.IdAction === action,
    )
  }

  async function logoutUser() {
    const token = useUserToken()
    token.value = undefined
    user.value = undefined
  }

  return {
    user,
    isLoggedIn,
    logoutUser,
    setUser,
    checkPermission,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
