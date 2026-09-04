"use client"
import { ReactNode } from 'react'
import Link from 'next/link'

interface ToolLayoutProps {
  title: string
  description: string
  icon?: string
  children: ReactNode
}

export default function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-400 transition">🏠 Home</Link>
        <span className="text-gray-700">›</span>
        <span className="text-gray-300 font-medium">{title}</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>

      {children}
    </div>
  )
}
