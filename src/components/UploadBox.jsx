import { useState } from "react"

import { FileText, FileUp, UploadCloud } from "lucide-react"
import api from "../services/api"

export function UploadBox({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setSelectedFile(file)
    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await api.post("/upload", formData)

      setMessage(response.data?.message ?? "File uploaded successfully")
      onFileSelect?.(file, response.data)
    } catch (error) {
      const backendDetail = error?.response?.data?.detail
      setMessage(backendDetail ? `Upload failed: ${backendDetail}` : "Upload failed.")
      console.error(error)
    } finally {
      setUploading(false)
      setSelectedFile(null)
      event.target.value = ""
    }
  }

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <label
        htmlFor="upload"
        className="group block cursor-pointer rounded-[2rem] border-2 border-dashed border-border bg-card/70 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-colors hover:border-emerald-400/35 hover:bg-muted/50 sm:px-8 sm:py-10"
      >
        <input
          id="upload"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleUpload}
        />

        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-emerald-500 sm:size-14">
          <UploadCloud className="size-6" />
        </div>

        <div className="mt-5 text-xl font-semibold text-foreground sm:mt-6 sm:text-2xl">
          {uploading
            ? "Uploading..."
            : "Drop files here"}
        </div>

        <div className="mt-3 text-sm text-muted-foreground sm:text-base">
          PDF, DOC, DOCX, TXT
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {selectedFile ? "Your file is uploaded. Pick another one to replace it." : "or click anywhere in this box to upload"}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:mt-6 sm:gap-3">
          <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <FileText className="size-3.5" />
            Supports long docs
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <FileUp className="size-3.5" />
            Instant parsing
          </span>
        </div>
      </label>

      {uploading ? (
        <p className="mt-4 text-amber-500">Uploading...</p>
      ) : null}

      {message ? (
        <p
          className={`mt-4 text-sm ${
            message.toLowerCase().includes("failed") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

export default UploadBox
