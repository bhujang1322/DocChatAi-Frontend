import { useRef } from "react"

import { Paperclip, SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onAttachFile,
  disabled = false,
}) {
  const fileInputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.()
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      onAttachFile?.(file)
    }

    event.target.value = ""
  }

  return (
    <form onSubmit={handleSubmit} className="px-2 pb-2 sm:px-6 lg:px-8">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#10151d] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <textarea
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="Ask anything about your document..."
          rows={1}
          className="w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <Button
            type="button"
            onClick={handleAttachClick}
            variant="ghost"
            className="h-10 rounded-xl border border-border bg-background px-4 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Paperclip className="size-4" />
            <span className="ml-2">Attach</span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-muted-foreground sm:flex">Send</div>
            <Button
              type="submit"
              className="h-11 w-11 rounded-2xl bg-emerald-500 p-0 text-[#07111b] hover:bg-emerald-400"
              disabled={disabled}
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ChatInput
