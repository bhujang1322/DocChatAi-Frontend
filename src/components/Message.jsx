import { Bot, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function Message({
  role,
  text,
  sources = [],
  citations = [],
  loading = false,
  onSourceSelect,
}) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[820px] gap-4", isUser && "flex-row-reverse")}>
        <Avatar className="size-10 shrink-0 border border-white/10 bg-white/[0.04]">
          <AvatarFallback className="bg-transparent text-foreground">
            {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
          </AvatarFallback>
        </Avatar>

        <div className={cn("space-y-3", isUser && "items-end")}>
          <div
            className={cn(
              "rounded-2xl border border-border px-5 py-4 text-sm leading-7 shadow-lg",
              isUser
                ? "bg-emerald-500/12 text-foreground"
                : "bg-card text-card-foreground"
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2 py-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-current animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="size-2 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.15s_infinite]" />
                <span className="size-2 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.3s_infinite]" />
                <span className="ml-2">{text}</span>
              </div>
            ) : (
              <span>
                {text}
                {citations.length > 0 ? (
                  <sup className="ml-1 align-super text-[0.7em] leading-none text-emerald-500">
                    {citations.map((citation) => (
                      <span key={citation.id} className="mr-0.5">
                        [{citation.index}]
                      </span>
                    ))}
                  </sup>
                ) : null}
              </span>
            )}
          </div>

          {sources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {citations.length > 0
                ? citations.map((citation) => (
                    <button
                      key={citation.id}
                      type="button"
                      onClick={() => onSourceSelect?.(citation.id)}
                      className="transition-transform hover:-translate-y-0.5"
                    >
                      <Badge
                        variant="outline"
                        className="border-border bg-background px-3 py-1 text-muted-foreground hover:border-emerald-400/40 hover:text-foreground"
                      >
                        {citation.label}
                      </Badge>
                    </button>
                  ))
                : sources.map((source) => (
                    <Badge
                      key={source}
                      variant="outline"
                      className="border-border bg-background px-3 py-1 text-muted-foreground"
                    >
                      {source}
                    </Badge>
                  ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Message
