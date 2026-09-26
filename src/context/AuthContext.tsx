import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Record<string, string>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { error: error ? error.message : null, needsConfirmation: !error && !data.session }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    })
  }

  const signInWithApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/account` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

      const updateProfile = async (data: Record<string, string>) => {
    if (!session) {
      return { error: 'Your session expired — please sign out and sign in again.' }
    }
    const { error: setErr } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
    if (setErr) {
      return { error: 'Your session expired — please sign out and sign in again.' }
    }
    const { error } = await supabase.auth.updateUser({ data })
    return { error: error ? error.message : null }
  }

  return (
    <AuthContext.Provider
      value={{ session, loading, signIn, signUp, signInWithGoogle, signInWithApple, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}