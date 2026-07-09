import { useEffect, useState } from "react"

import AuthPage from "./pages/AuthPage"
import ChatPage from "./pages/ChatPage"
import supabase from "@/lib/supabase"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return
      }

      setSession(data.session ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading DocChat...</div>
      </div>
    )
  }

  return (
    session ? (
      <ChatPage
        session={session}
        onSignOut={() => supabase.auth.signOut()}
      />
    ) : (
      <AuthPage />
    )
  )
}

export default App
