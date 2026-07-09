import { ScrollArea } from "@/components/ui/scroll-area"
import Message from "@/components/Message"

export function ChatMessages({ messages, onSourceSelect }) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            text={message.text}
            sources={message.sources}
            citations={message.citations}
            loading={message.loading}
            onSourceSelect={onSourceSelect}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export default ChatMessages
