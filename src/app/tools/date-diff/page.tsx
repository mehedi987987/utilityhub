"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function DateDiffPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; hours: number } | null>(null)

  const calculate = () => {
    if (!from || !to) return
    const d1 = new Date(from), d2 = new Date(to)
    const diff = Math.abs(d2.getTime() - d1.getTime())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    setResult({
      days,
      weeks: Math.floor(days / 7),
      months: Math.floor(days / 30.44),
      hours: Math.floor(diff / (1000 * 60 * 60)),
    })
  }

  return (
    <ToolLayout title="Date Difference Calculator" description="Calculate the number of days, weeks, and months between two dates.">
      <TokenGate slug="date-diff">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">From Date</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full h-12 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">To Date</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full h-12 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
          </div>
          <button onClick={calculate} className="w-full bg-blue text-white py-3 rounded-xl text-sm font-bold">Calculate Difference</button>
        </div>

        {result && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-xl p-5 text-center">
              <p className="text-3xl font-extrabold">{result.days}</p>
              <p className="text-xs opacity-80 mt-1">Days</p>
            </div>
            <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl p-5 text-center">
              <p className="text-3xl font-extrabold">{result.weeks}</p>
              <p className="text-xs opacity-80 mt-1">Weeks</p>
            </div>
            <div className="bg-gradient-to-b from-blue-400 to-blue-500 text-white rounded-xl p-5 text-center">
              <p className="text-3xl font-extrabold">{result.months}</p>
              <p className="text-xs opacity-80 mt-1">Months</p>
            </div>
            <div className="bg-gradient-to-b from-blue-300 to-blue-400 text-white rounded-xl p-5 text-center">
              <p className="text-3xl font-extrabold">{result.hours.toLocaleString()}</p>
              <p className="text-xs opacity-80 mt-1">Hours</p>
            </div>
          </div>
        )}
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
