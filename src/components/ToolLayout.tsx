"use client"
import { ReactNode } from 'react'
import Link from 'next/link'
import AdRail from '@/components/ads/AdRail'

interface ToolLayoutProps {
  title: string
  description: string
  icon?: string
  children: ReactNode
}

export default function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  return (
    <div className="hero-glow">
      <div className="max-w-[1100px] mx-auto px-4 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 mb-5">
          <Link href="/" className="hover:text-violet-300 transition">Home</Link>
          <span className="text-gray-700" aria-hidden="true">›</span>
          <Link href="/#tools" className="hover:text-violet-300 transition">Tools</Link>
          <span className="text-gray-700" aria-hidden="true">›</span>
          <span className="text-gray-300 font-medium">{title}</span>
        </nav>

        {/* Title */}
        <div className="flex items-start gap-4 mb-7">
          {icon && (
            <span className="icon-tile !w-12 !h-12 !text-2xl flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{description}</p>
          </div>
        </div>

        {children}

        {/* Ad sits after the tool, never between the user and the controls. */}
        <AdRail className="mt-10 pt-6 border-t border-white/5" />
      </div>
    </div>
  )
}
