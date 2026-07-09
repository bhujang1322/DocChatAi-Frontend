import { MoreHorizontal, MoonStar, PanelLeft, Settings, SunMedium } from "lucide-react"

import { useTheme } from "@/components/theme-provider"

export function Navbar({ isSidebarVisible = true, onToggleSidebar, onSignOut }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark" || theme === "system"

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header className="flex h-13 items-center justify-between border-b border-border bg-background/85 px-5 text-foreground backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
          title={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-background/80 text-muted-foreground transition-colors hover:bg-muted"
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Navbar
