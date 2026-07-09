import { Bot, Database, FileSearch, Sparkles } from "lucide-react"

import PromptCards from "./PromptCards"

const highlights = [
  {
    icon: Database,
    title: "Cloud-stored documents",
    description: "Your library is already in Cloudflare, ready to query.",
  },
  {
    icon: FileSearch,
    title: "Ask grounded questions",
    description: "Get answers with clickable citations and source previews.",
  },
  {
    icon: Sparkles,
    title: "Fast follow-ups",
    description: "Keep the conversation going across your chat history.",
  },
]

export function WelcomeScreen({ onPromptSelect, expanded = false }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto px-4 py-4 sm:justify-center sm:py-6 lg:py-8">
      <div className={expanded ? "w-full max-w-5xl" : "w-full max-w-3xl"}>
        <div className="mx-auto flex w-fit flex-col items-center">
          <div className="flex size-20 items-center justify-center rounded-[1.5rem] border border-emerald-400/35 bg-emerald-400/10 text-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] sm:size-24">
            <Bot className="size-10 sm:size-12" />
          </div>
          <h1 className="mt-4 text-center text-3xl font-semibold tracking-tight text-foreground sm:mt-5 sm:text-5xl">
            DocChat AI
          </h1>
          <p className="mt-3 max-w-xl text-center text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base">
            Your document intelligence workspace is ready. Start from history, search
            saved chats, and ask questions from your cloud library.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card/70 p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <h2 className="mt-4 text-sm font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 sm:mt-8">
          <PromptCards onPromptSelect={onPromptSelect} />
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
