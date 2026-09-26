import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

/** Checks the `admins` table for the current user -- see supabase/migration-3-admin-lockdown.sql */
export function useIsAdmin() {
  const { session } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!session) {
      setIsAdmin(false)
      setChecked(true)
      return
    }
    setChecked(false)
    supabase
      .from('admins')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data)
        setChecked(true)
      })
  }, [session])

  return { isAdmin, checked }
}