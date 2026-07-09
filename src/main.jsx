import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App"
import { ThemeProvider } from "@/components/theme-provider"

const container = document.getElementById("root")

if (!container) {
  throw new Error("Root element not found")
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="docchat-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
)
