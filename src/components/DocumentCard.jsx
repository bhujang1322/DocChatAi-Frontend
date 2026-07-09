import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DocumentCard({ document, active, onClick }) {
  const tags = Array.isArray(document?.tags) ? document.tags : []

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left transition-transform hover:-translate-y-0.5",
        active && "scale-[1.01]"
      )}
    >
      <Card
        className={cn(
          "border-white/10 bg-white/[0.03] p-4 shadow-none transition-colors",
          active && "border-emerald-400/30 bg-emerald-400/[0.06]"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] tracking-[0.18em] text-zinc-400"
          >
            {document.page}
          </Badge>
          <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Preview
          </span>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white">
          {document?.title ?? document?.page ?? "Source"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {document?.excerpt ?? "No preview available."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </button>
  )
}

export default DocumentCard
