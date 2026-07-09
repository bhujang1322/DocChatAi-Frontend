import {
  Bot,
  FileText,
  FileSearch,
  MessageSquare,
  Sparkles,
  Crown,
  LayoutDashboard,
  PenLine,
  Search,
} from "lucide-react"

export const conversationGroups = [
  {
    label: "Today",
    items: [
      {
        id: "q4-financial",
        title: "Q4 Financial Report Analysis",
        time: "10:24 AM",
        icon: FileSearch,
        active: true,
      },
      {
        id: "market-research",
        title: "Market Research Summary",
        time: "09:15 AM",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "nda-draft",
        title: "Contract Review - NDA Draft",
        time: "05:45 PM",
        icon: FileText,
      },
      {
        id: "sales-review",
        title: "Sales Performance Review",
        time: "02:30 PM",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Previous 7 Days",
    items: [
      {
        id: "llm-paper",
        title: "LLM Benchmark Research Paper",
        time: "2d ago",
        icon: FileSearch,
      },
      {
        id: "handbook",
        title: "Employee Handbook Updates",
        time: "3d ago",
        icon: MessageSquare,
      },
      {
        id: "tech-docs",
        title: "Technical Documentation Review",
        time: "5d ago",
        icon: FileText,
      },
      {
        id: "requirements",
        title: "Product Requirements Analysis",
        time: "7d ago",
        icon: MessageSquare,
      },
    ],
  },
]

export const promptCards = [
  {
    id: "summarize",
    icon: LayoutDashboard,
    title: "Summarize this document",
    description: "Get a concise overview",
  },
  {
    id: "extract",
    icon: FileText,
    title: "Extract key data points",
    description: "Numbers, dates and facts",
  },
  {
    id: "actions",
    icon: Sparkles,
    title: "Find action items",
    description: "Identify tasks and next steps",
  },
  {
    id: "compare",
    icon: Search,
    title: "Compare sections",
    description: "Analyze differences and similarities",
  },
]

export const sourceDocuments = [
  {
    id: "page-18",
    page: "Page 18",
    title: "Retrieval Augmented Generation",
    excerpt:
      "Retrieval Augmented Generation retrieves relevant chunks from the vector database before passing them to the language model. This improves factual accuracy.",
    tags: ["Core concept", "Cited source"],
  },
  {
    id: "page-20",
    page: "Page 20",
    title: "Embedding similarity",
    excerpt:
      "Embedding similarity ranks the retrieved passages so the assistant can respond with context that is both relevant and current.",
    tags: ["Ranking", "Semantic search"],
  },
  {
    id: "page-22",
    page: "Page 22",
    title: "Answer grounding",
    excerpt:
      "Grounded answers reference the source document directly and reduce hallucinations by keeping the response tied to evidence.",
    tags: ["Grounded", "Evidence-based"],
  },
]

export const welcomeHighlights = [
  {
    id: "upload",
    icon: Bot,
    title: "Upload any document",
    description: "PDF, DOCX, TXT, CSV or MD",
  },
  {
    id: "ask",
    icon: PenLine,
    title: "Ask follow-up questions",
    description: "Explore your file with natural language",
  },
  {
    id: "citations",
    icon: Crown,
    title: "See grounded sources",
    description: "Every answer points back to evidence",
  },
]

export const initialMessages = [
  {
    id: "m-1",
    role: "user",
    text: "Summarize Chapter 2.",
  },
  {
    id: "m-2",
    role: "assistant",
    text:
      "Chapter 2 explains how retrieval augmented generation works and why vector search improves factual accuracy before the answer is generated.",
    sources: ["Page 18", "Page 20", "Page 22"],
  },
]
