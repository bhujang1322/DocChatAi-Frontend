# RAG Pipeline

This document describes the retrieval/answering pipeline that can be verified from code.

## What is Confirmed in Code

### Upload path

- `POST /upload` stores the file locally in `backend/app/uploads/`
- `CloudFlareService.upload_document()` uploads the file to Cloudflare AI Search

References:
- [backend/routes/upload.py](../backend/routes/upload.py)
- [backend/services/cloudflareser.py](../backend/services/cloudflareser.py)

### Retrieval path

- `CloudFlareService.ask_question(question)` first POSTs the question to the Cloudflare `search` endpoint
- It then POSTs the same question to `chat/completions`
- The service extracts the answer from the chat response
- The service extracts source snippets from the search response

Reference:
- [backend/services/cloudflareser.py](../backend/services/cloudflareser.py)

## Observed Pipeline

```mermaid
flowchart TD
  Q[User question] --> F[FastAPI /chat]
  F --> S[CloudFlareService.ask_question]
  S --> SRCH[Cloudflare AI Search /search]
  S --> CHAT[Cloudflare AI Search /chat/completions]
  SRCH --> SRC[Normalized source list]
  CHAT --> ANS[Answer text]
  SRC --> UI1[ChatPage normalizes sources]
  ANS --> UI2[ChatMessages renders assistant message]
  SRC --> UI3[SourcePanel renders evidence]
```

## Citation Generation

What the code does:

- `ChatPage` builds numbered citations from the normalized sources with `buildCitations()`
- `Message` renders the citations in the assistant bubble
- Clicking a citation badge passes the source id back up to `ChatPage`
- `SourcePanel` scrolls the active item into view when a citation/source is selected

References:
- [src/pages/ChatPage.jsx](../src/pages/ChatPage.jsx)
- [src/components/Message.jsx](../src/components/Message.jsx)
- [src/components/SourcePanel.jsx](../src/components/SourcePanel.jsx)

## What Is Not Visible in Code

The repository does not show:

- the actual chunking algorithm
- the embedding model name
- vector similarity settings
- prompt template for retrieval-grounded generation
- whether Cloudflare handles chunking and embeddings internally or via an external index

So the only accurate statement is that the app uses Cloudflare AI Search endpoints to upload documents, search them, and generate answers.

