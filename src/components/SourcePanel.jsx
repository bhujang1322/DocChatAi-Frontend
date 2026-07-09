import { useEffect, useRef } from "react"

import { BookOpen, ChevronRight } from "lucide-react"

import DocumentCard from "@/components/DocumentCard"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function SourcePanel({
  activeSourceId,
  onSourceSelect,
  sources = [],
}) {
  const sourceList = Array.isArray(sources) ? sources : []
  const activeSource =
    sourceList.find((document) => document.id === activeSourceId) ?? null
  const itemRefs = useRef(new Map())

  useEffect(() => {
    if (!activeSourceId) {
      return
    }

    const element = itemRefs.current.get(activeSourceId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeSourceId])

  return (
    <aside className="hidden h-dvh max-h-dvh min-h-0 overflow-hidden border-l border-border bg-card text-card-foreground xl:flex xl:w-[420px] xl:flex-col">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Source Preview</h2>
            <p className="text-xs text-muted-foreground">Grounded evidence from your files</p>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-5 py-4">
          {activeSource ? (
            <>
              <DocumentCard document={activeSource} active />

              <Separator className="bg-border" />

              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  More sources
                </h3>
                <div className="space-y-3">
                  {sourceList.map((document) => (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => onSourceSelect?.(document.id)}
                      ref={(node) => {
                        if (node) {
                          itemRefs.current.set(document.id, node)
                          return
                        }

                        itemRefs.current.delete(document.id)
                      }}
                      className="w-full text-left transition-transform hover:-translate-y-0.5"
                    >
                      <Card
                        className={
                          document.id === activeSourceId
                            ? "border-emerald-400/50 bg-emerald-400/8 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
                            : "border-border bg-background p-4 shadow-none"
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-foreground">
                            {document.page}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {document.title}
                        </p>
                      </Card>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="border-border bg-background p-6 shadow-none">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  No source preview yet
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Upload a document and ask a question to see the retrieved
                  pages here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

export default SourcePanel
