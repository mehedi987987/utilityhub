"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function PercentagePage() {
  const [mode, setMode] = useState<'percent' | 'change' | 'of'>('percent')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const na = parseFloat(a), nb = parseFloat(b)
    if (isNaN(na) || isNaN(nb)) return
    if (mode === 'percent') setResult(`${((na / nb) * 100).toFixed(2)}%`)
    else if (mode === 'change') setResult(`${(((nb - na) / na) * 100).toFixed(2)}%`)
    else setResult(`${(na * nb / 100).toFixed(2)}`)
  }

  const labels: Record<string, [string, string]> = {
    percent: ['Part', 'Whole'],
    change: ['Old Value', 'New Value'],
    of: ['Number', 'Percentage (%)'],
  }

  return (
    <ToolLayout title="Percentage Calculator" description="Calculate percentages, percentage change, and find X% of a number.">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <div className="flex gap-2 mb-4">
            {(['percent', 'change', 'of'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setResult(null) }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${mode === m ? 'bg-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                {m === 'percent' ? 'X is what % of Y' : m === 'change' ? '% Change' : 'X% of Y'}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">{labels[mode][0]}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="0"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-lg" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">{labels[mode][1]}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="0"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-lg" />
            </div>
          </div>
          <button onClick={calculate} className="w-full bg-blue text-white py-3 rounded-xl text-sm font-bold mt-4">Calculate</button>
        </div>

        {result !== null && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 text-center">
            <p className="text-sm opacity-80">Result</p>
            <p className="text-4xl font-extrabold mt-2">{result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
