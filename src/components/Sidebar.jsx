import { Bot, LogOut, Search, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function SidebarItem({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      className={cn(
        "group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted",
        item.active && "bg-muted"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md border border-border text-emerald-500",
            item.active && "bg-emerald-400/10"
          )}
        >
          <Bot className="size-3.5" />
        </span>
        <span className="min-w-0 truncate text-sm text-foreground">
          {item.title}
        </span>
      </div>
      <span className="ml-3 shrink-0 text-xs text-muted-foreground">{item.time}</span>
    </button>
  )
}

export function Sidebar({
  chats = [],
  activeChatId,
  onNewChat,
  onChatSelect,
  searchQuery,
  onSearchChange,
  userEmail = "",
  onSignOut,
}) {
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r border-border bg-card text-card-foreground">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-[#07111b] shadow-lg shadow-emerald-500/20">
              <Bot className="size-6" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">DocChat</div>
              <p className="text-xs text-muted-foreground">Cloud-stored knowledge</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onNewChat}
            className="h-10 rounded-xl border border-border bg-background px-4 text-foreground hover:bg-muted"
          >
            New Chat
          </Button>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search conversations..."
            className="h-12 rounded-2xl border-border bg-background pl-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-400/30"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ⌘K
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-5">
          <section className="space-y-3">
            <h2 className="px-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Chat history
            </h2>
            <div className="space-y-1">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <SidebarItem
                    key={chat.id}
                    item={{
                      ...chat,
                      active: chat.id === activeChatId,
                    }}
                    onSelect={onChatSelect}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                  No chats match your search.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Signed in as
              </p>
              <p className="truncate text-sm font-medium text-foreground">
                {userEmail || "Unknown user"}
              </p>
            </div>
          </section>
        </div>
      </ScrollArea>

      <Separator className="bg-border" />

      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
          {userEmail ? userEmail.slice(0, 2).toUpperCase() : "JD"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {userEmail || "Jane Doe"}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {userEmail || "jane@company.com"}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
