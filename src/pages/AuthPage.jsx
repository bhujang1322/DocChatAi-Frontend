import { useMemo, useState } from "react"

import { Bot, Globe, Lock, Mail, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import supabase from "@/lib/supabase"

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const isSignUp = mode === "signup"

  const heading = useMemo(
    () => (isSignUp ? "Create your account" : "Welcome back"),
    [isSignUp]
  )

  const subheading = useMemo(
    () =>
      isSignUp
        ? "Create a Supabase account to start using DocChat."
        : "Sign in to open your document chat workspace.",
    [isSignUp]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")

    if (!email || !password) {
      setMessage("Please enter your email and password.")
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          throw error
        }

        setMessage("Account created. Check your email to verify your account.")
        onAuthenticated?.()
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        onAuthenticated?.()
      }
    } catch (error) {
      setMessage(error?.message ?? "Authentication failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setMessage("")
    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      setMessage(error?.message ?? "Google sign in failed.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(180deg,_var(--background)_0%,_color-mix(in_oklab,var(--background)_94%,black)_100%)] px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center rounded-[2rem] border border-border bg-card/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-500">
              <Bot className="size-8" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              DocChat
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Log in to upload documents, ask questions, and jump through source
              citations with a single click.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Supabase auth",
                "Private workspace",
                "Cited answers",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background/80 p-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="border-border bg-card/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-500">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{heading}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
              </div>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-2xl border-border bg-background text-foreground hover:bg-muted"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Globe className="mr-2 size-4" />
                Continue with Google
              </Button>

              <div className="relative py-2">
                <div className="h-px w-full bg-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  or
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                    className="h-12 rounded-2xl border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {isSignUp ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repeat your password"
                      className="h-12 rounded-2xl border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              ) : null}

              {message ? (
                <p className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  {message}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-emerald-500 text-[#07111b] hover:bg-emerald-400"
                disabled={loading}
              >
                {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to DocChat?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignUp ? "signin" : "signup")
                  setMessage("")
                }}
                className="font-medium text-emerald-500 hover:text-emerald-400"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
