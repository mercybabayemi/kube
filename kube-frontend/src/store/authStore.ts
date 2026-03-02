import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh })
        localStorage.setItem('kube_access_token', access)
        localStorage.setItem('kube_refresh_token', refresh)
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
        localStorage.removeItem('kube_access_token')
        localStorage.removeItem('kube_refresh_token')
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    { name: 'kube-auth' }
  )
)
