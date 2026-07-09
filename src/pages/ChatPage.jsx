import { useEffect, useMemo, useState } from "react"

import ChatInput from "@/components/ChatInput"
import ChatMessages from "@/components/ChatMessages"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import SourcePanel from "@/components/SourcePanel"
import WelcomeScreen from "@/components/WelcomeScreen"
import api from "@/services/api"
import supabase from "@/lib/supabase"

function normalizeSource(source, index) {
  const id = String(source?.id ?? source?.page ?? source?.title ?? `source-${index}`)

  return {
    id,
    page: source?.page ?? `Source ${index + 1}`,
    title: source?.title ?? source?.page ?? `Source ${index + 1}`,
    excerpt: source?.excerpt ?? "",
    tags: Array.isArray(source?.tags) ? source.tags : [],
    score: source?.score,
  }
}

function buildCitations(nextSources) {
  return nextSources.map((source, index) => ({
    id: source.id,
    label: source.page,
    index: index + 1,
  }))
}

function createDefaultSession() {
  return [
    {
      id: "chat-1",
      title: "New chat",
      messages: [],
    },
  ]
}

export function ChatPage({ session, onSignOut }) {
  const userId = session?.user?.id ?? "anonymous"
  const userEmail = session?.user?.email ?? ""

  const [chatSessions, setChatSessions] = useState(() => createDefaultSession())
  const [activeChatId, setActiveChatId] = useState("chat-1")
  const [draft, setDraft] = useState("")
  const [activeSourceId, setActiveSourceId] = useState(null)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [availableSources, setAvailableSources] = useState([])
  const [hasUploadedFile, setHasUploadedFile] = useState(false)
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingAssistantMessage, setPendingAssistantMessage] = useState(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    let isActive = true

    const loadHistory = async () => {
      setIsLoadingHistory(true)

      const { data: chats, error: chatsError } = await supabase
        .from("chats")
        .select("id, title, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!isActive) {
        return
      }

      if (chatsError) {
        console.error(chatsError)
        setChatSessions(createDefaultSession())
        setActiveChatId("chat-1")
        setIsLoadingHistory(false)
        return
      }

      if (!chats || chats.length === 0) {
        setChatSessions(createDefaultSession())
        setActiveChatId("chat-1")
        setIsLoadingHistory(false)
        return
      }

      const chatIds = chats.map((chat) => chat.id)

      const { data: messages, error: messagesError } = await supabase
        .from("chat_messages")
        .select("id, chat_id, role, text, citations, sources, created_at")
        .in("chat_id", chatIds)
        .order("created_at", { ascending: true })

      if (!isActive) {
        return
      }

      if (messagesError) {
        console.error(messagesError)
        setChatSessions(createDefaultSession())
        setActiveChatId("chat-1")
        setIsLoadingHistory(false)
        return
      }

      const nextSessions = chats.map((chat, index) => ({
        id: chat.id,
        title: chat.title || "New chat",
        messages: (messages ?? [])
          .filter((message) => message.chat_id === chat.id)
          .map((message) => ({
            id: message.id,
            role: message.role,
            text: message.text,
            citations: Array.isArray(message.citations) ? message.citations : [],
            sources: Array.isArray(message.sources) ? message.sources : [],
            loading: false,
          })),
      }))

      setChatSessions(nextSessions)
      setActiveChatId(nextSessions[0]?.id ?? "chat-1")
      setIsLoadingHistory(false)
    }

    loadHistory()

    return () => {
      isActive = false
    }
  }, [userId])

  const activeChat =
    chatSessions.find((sessionItem) => sessionItem.id === activeChatId) ?? chatSessions[0]
  const messages = activeChat?.messages ?? []
  const activeSource =
    availableSources.find((document) => document.id === activeSourceId) ?? null
  const showSourcePanel = hasUploadedFile && hasAnsweredQuestion

  const updateChatById = (chatId, updater) => {
    setChatSessions((currentSessions) =>
      currentSessions.map((sessionItem) =>
        sessionItem.id === chatId ? updater(sessionItem) : sessionItem
      )
    )
  }

  const persistMessage = async (chatId, message) => {
    const payload = {
      chat_id: chatId,
      role: message.role,
      text: message.text,
      citations: message.citations ?? [],
      sources: message.sources ?? [],
    }

    const { error } = await supabase.from("chat_messages").insert(payload)
    if (error) {
      throw error
    }
  }

  const createRemoteChat = async (title) => {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: userId,
        title,
      })
      .select("id, title, created_at")
      .single()

    if (error) {
      throw error
    }

    return data
  }

  const uploadDocument = async (file) => {
    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/upload", formData)
    handleFileSelect(file, response.data)
  }

  const gridLayoutClass = isSidebarVisible
    ? showSourcePanel
      ? "grid h-full min-h-0 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_420px]"
      : "grid h-full min-h-0 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]"
    : showSourcePanel
      ? "grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_420px]"
      : "grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)]"

  const submitQuestion = async (question) => {
    const trimmed = question.trim()
    if (!trimmed) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    }

    let currentChatId = activeChatId

    if (activeChat?.title === "New chat" && activeChat?.messages?.length === 0) {
      try {
        const remoteChat = await createRemoteChat(trimmed.slice(0, 36))
        currentChatId = remoteChat.id
        setActiveChatId(remoteChat.id)
        updateChatById(activeChatId, (sessionItem) => ({
          ...sessionItem,
          id: remoteChat.id,
          title: remoteChat.title,
        }))
      } catch (error) {
        console.error(error)
      }
    }

    const targetChatId = currentChatId

    setChatSessions((currentSessions) =>
      currentSessions.map((sessionItem) =>
        sessionItem.id === targetChatId
          ? {
              ...sessionItem,
              title: sessionItem.title === "New chat" ? trimmed.slice(0, 36) : sessionItem.title,
              messages: [...sessionItem.messages, userMessage],
            }
          : sessionItem
      )
    )
    setDraft("")
    setIsSending(true)
    setPendingAssistantMessage({
      id: `assistant-pending-${Date.now()}`,
      role: "assistant",
      text: "Thinking...",
      loading: true,
      sources: [],
    })

    try {
      const response = await api.post("/chat", {
        message: trimmed,
      })

      const answer =
        response.data?.answer ??
        response.data?.message ??
        response.data?.result?.response ??
        response.data?.result?.choices?.[0]?.message?.content ??
        "I could not generate a response from Cloudflare."
      const nextSources = Array.isArray(response.data?.sources)
        ? response.data.sources.map(normalizeSource)
        : []
      const citations = buildCitations(nextSources)

      if (nextSources.length > 0) {
        setAvailableSources(nextSources)
        setActiveSourceId(nextSources[0].id)
      } else {
        setAvailableSources([])
        setActiveSourceId(null)
      }

      updateChatById(targetChatId, (sessionItem) => ({
        ...sessionItem,
        messages: [
          ...sessionItem.messages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: answer,
            citations,
            sources:
              nextSources.length > 0
                ? nextSources.map((source) => source.page)
                : [],
          },
        ],
      }))

      try {
        await persistMessage(targetChatId, {
          ...userMessage,
          citations: [],
          sources: [],
        })
        await persistMessage(targetChatId, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: answer,
          citations,
          sources:
            nextSources.length > 0
              ? nextSources.map((source) => source.page)
              : [],
        })
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)

      setAvailableSources([])
      setActiveSourceId(null)

      updateChatById(targetChatId, (sessionItem) => ({
        ...sessionItem,
        messages: [
          ...sessionItem.messages,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text:
              "I could not reach the Cloudflare backend. Check that FastAPI is running and your Cloudflare settings are valid.",
            citations: [],
            sources: [],
          },
        ],
      }))
    } finally {
      setPendingAssistantMessage(null)
      setHasAnsweredQuestion(true)
      setIsSending(false)
    }
  }

  const handlePromptSelect = (prompt) => {
    submitQuestion(prompt)
  }

  const handleSubmit = () => {
    submitQuestion(draft)
  }

  const handleNewChat = () => {
    const localChatId = `chat-${Date.now()}`

    setChatSessions((currentSessions) => [
      {
        id: localChatId,
        title: "New chat",
        messages: [],
      },
      ...currentSessions,
    ])
    setActiveChatId(localChatId)

    createRemoteChat("New chat")
      .then((remoteChat) => {
        updateChatById(localChatId, (sessionItem) => ({
          ...sessionItem,
          id: remoteChat.id,
          title: remoteChat.title,
        }))
        setActiveChatId(remoteChat.id)
      })
      .catch((error) => {
        console.error(error)
        setActiveChatId(localChatId)
      })
    setDraft("")
    setAvailableSources([])
    setActiveSourceId(null)
    setPendingAssistantMessage(null)
    setHasUploadedFile(false)
    setHasAnsweredQuestion(false)
    setIsSending(false)
  }

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId)
    setActiveSourceId(null)
    setAvailableSources([])
    setHasUploadedFile(false)
    setHasAnsweredQuestion(false)
    setDraft("")
    setPendingAssistantMessage(null)
  }

  const handleFileSelect = (file, uploadResponse) => {
    setHasUploadedFile(true)
    setHasAnsweredQuestion(false)
    setAvailableSources([])
    setActiveSourceId(null)
    setPendingAssistantMessage(null)
    const uploadMessages = [
      {
        id: `user-upload-${Date.now()}`,
        role: "user",
        text: `Uploaded ${file.name}`,
      },
      {
        id: `assistant-upload-${Date.now()}`,
        role: "assistant",
        text:
          uploadResponse?.message ??
          "File received. You can ask questions about it now.",
        citations: [],
        sources: [],
      },
    ]

    updateChatById(activeChatId, (sessionItem) => ({
      ...sessionItem,
      messages: [...sessionItem.messages, ...uploadMessages],
    }))

    uploadMessages.forEach((message) => {
      persistMessage(activeChatId, message).catch((error) => {
        console.error(error)
      })
    })
  }

  const handleAttachFile = async (file) => {
    try {
      await uploadDocument(file)
    } catch (error) {
      console.error(error)
      setPendingAssistantMessage(null)
      updateChatById(activeChatId, (sessionItem) => ({
        ...sessionItem,
        messages: [
          ...sessionItem.messages,
          {
            id: `assistant-upload-error-${Date.now()}`,
            role: "assistant",
            text:
              "I could not upload that file. Please try another document or check the backend.",
            sources: [],
          },
        ],
      }))
    }
  }

  const sidebarChats = useMemo(
    () =>
      chatSessions.map((sessionItem, index) => ({
        id: sessionItem.id,
        title: sessionItem.title,
        time: index === 0 ? "Now" : `${index} chat${index > 1 ? "s" : ""} ago`,
        active: sessionItem.id === activeChatId,
      })),
    [activeChatId, chatSessions]
  )

  const visibleMessages = pendingAssistantMessage
    ? [...messages, pendingAssistantMessage]
    : messages

  if (isLoadingHistory) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading your chats...</div>
      </div>
    )
  }

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className={gridLayoutClass}>
        {isSidebarVisible ? (
          <Sidebar
            chats={sidebarChats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onChatSelect={handleChatSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userEmail={userEmail}
            onSignOut={onSignOut}
          />
        ) : null}

        <main className="flex h-full min-w-0 min-h-0 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--primary)_14%,transparent),_transparent_34%),linear-gradient(180deg,_var(--background)_0%,_color-mix(in_oklab,var(--background)_94%,black)_100%)]">
          <Navbar
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((current) => !current)}
            onSignOut={onSignOut}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {messages.length > 0 ? (
              <ChatMessages
                messages={visibleMessages}
                onSourceSelect={setActiveSourceId}
              />
            ) : (
              <WelcomeScreen
                onPromptSelect={handlePromptSelect}
                expanded={!showSourcePanel}
              />
            )}

            <ChatInput
              value={draft}
              onChange={setDraft}
              onSubmit={handleSubmit}
              onAttachFile={handleAttachFile}
              disabled={isSending}
            />
          </div>
        </main>

        {showSourcePanel ? (
          <SourcePanel
            activeSourceId={activeSource?.id}
            onSourceSelect={setActiveSourceId}
            sources={availableSources}
          />
        ) : null}
      </div>
    </div>
  )
}

export default ChatPage
