"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0,
    lines: text.trim() ? text.split('\n').length : 0,
    readingTime: Math.ceil(text.trim().split(/\s+/).length / 200),
    speakingTime: Math.ceil(text.trim().split(/\s+/).length / 130),
  }

  return (
    <ToolLayout title="Word Counter" icon="📝" description="Count words, characters, sentences, and more.">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="card p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-[400px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-4">📊 Statistics</h3>
            <div className="space-y-3">
              <StatItem label="Characters" value={stats.characters} />
              <StatItem label="Characters (no spaces)" value={stats.charactersNoSpaces} />
              <StatItem label="Words" value={stats.words} />
              <StatItem label="Sentences" value={stats.sentences} />
              <StatItem label="Paragraphs" value={stats.paragraphs} />
              <StatItem label="Lines" value={stats.lines} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-4">⏱️ Reading Time</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{stats.readingTime}</p>
              <p className="text-xs text-gray-400 mt-1">minutes</p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-white mb-4">🎤 Speaking Time</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{stats.speakingTime}</p>
              <p className="text-xs text-gray-400 mt-1">minutes</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-bold text-white">{value.toLocaleString()}</span>
    </div>
  )
}
