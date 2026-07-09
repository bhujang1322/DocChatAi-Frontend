import { promptCards } from "@/data/chatData"

function PromptCard({ card, onClick }) {
  const Icon = card.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card/70 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-muted/60"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-emerald-500">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {card.description}
          </p>
        </div>
      </div>
    </button>
  )
}

export function PromptCards({ onPromptSelect }) {
  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="mb-4 text-center text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
        Try these prompts
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {promptCards.map((card) => (
          <PromptCard
            key={card.id}
            card={card}
            onClick={() => onPromptSelect?.(card.title)}
          />
        ))}
      </div>
    </div>
  )
}

export default PromptCards
