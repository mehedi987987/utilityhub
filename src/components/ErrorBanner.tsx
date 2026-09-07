"use client"

interface ErrorBannerProps {
  message: string | null
  onDismiss?: () => void
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4 flex items-start gap-3"
    >
      <span className="text-lg leading-none" aria-hidden="true">⚠️</span>
      <p className="flex-1 text-sm text-red-300 font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 text-sm leading-none"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  )
}
