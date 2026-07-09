# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Supabase chat history

The app stores chat history in Supabase tables. Apply the schema in `supabase/schema.sql`
from the Supabase SQL editor to create the `chats` and `chat_messages` tables and the
required Row Level Security policies.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
