import { useState, useEffect } from 'react'

type UploadResponse = {
  shareableLink: string
  expiresAt: string | number
}

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [result, setResult] = useState<UploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000) // Clear error after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleUpload = async (): Promise<void> => {
    if (!file) return

    setUploading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/file/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: UploadResponse = await response.json()
      setResult(data)
      if (import.meta.env.DEV) {
        console.log('Upload response:', data)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      if (import.meta.env.DEV) {
        console.error('Upload error:', err)
      }
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const downloadUrl = result ? `${window.location.origin}/${result.shareableLink}` : ''

  return (
    <div className="min-h-screen bg-background">
      {/* Toast for copy feedback */}
      {copied && (
        <div className="fixed top-8 right-8 z-50 bg-success text-success-foreground px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          Link copied to clipboard
        </div>
      )}

      <div className="container mx-auto px-6 py-20 max-w-lg">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-primary/25">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            YeetBox
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Share files instantly and securely
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl animate-scale-in">
          {/* File Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-card-foreground mb-4">
              Choose file
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-muted file:cursor-pointer file:transition-colors bg-input border border-border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {file && (
              <div className="mt-4 p-4 bg-surface border border-border rounded-lg animate-slide-up">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            type='submit'
            disabled={!file || uploading}
            className="w-full py-4 px-6 bg-primary hover:bg-primary-hover disabled:bg-muted text-primary-foreground disabled:text-muted-foreground font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-3" />
                Uploading...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload file
              </div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-slide-up">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-semibold">Upload failed</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-xl animate-slide-up">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Upload complete</h3>
                <p className="text-muted-foreground">Your file is ready to share</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Download Link */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Download link
                </label>
                <div className="flex bg-input border border-border rounded-lg overflow-hidden">
                  <div className="flex-1 px-4 py-3 font-mono text-sm text-foreground truncate">
                    {downloadUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(downloadUrl)}
                    type='button'
                    className="px-4 py-3 bg-primary hover:bg-primary-hover text-primary-foreground transition-colors"
                    title="Copy link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expiry Info */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center text-sm text-muted-foreground">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expires {new Date(result.expiresAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App