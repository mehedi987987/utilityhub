"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function AgePage() {
  const [dob, setDob] = useState('')
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null)

  const calculate = () => {
    if (!dob) return
    const birth = new Date(dob)
    const today = new Date()
    if (birth > today) return

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    setResult({ years, months, days, totalDays })
  }

  return (
    <ToolLayout title="Age Calculator" description="Find your exact age in years, months, and days.">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-3">Enter your date of birth</h2>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
            className="w-full h-12 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white mb-3" />
          <button onClick={calculate} className="w-full bg-blue text-white py-3 rounded-xl text-sm font-bold">Calculate Age</button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-xl p-5 text-center">
                <p className="text-3xl font-extrabold">{result.years}</p>
                <p className="text-xs opacity-80 mt-1">Years</p>
              </div>
              <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl p-5 text-center">
                <p className="text-3xl font-extrabold">{result.months}</p>
                <p className="text-xs opacity-80 mt-1">Months</p>
              </div>
              <div className="bg-gradient-to-b from-blue-400 to-blue-500 text-white rounded-xl p-5 text-center">
                <p className="text-3xl font-extrabold">{result.days}</p>
                <p className="text-xs opacity-80 mt-1">Days</p>
              </div>
            </div>
            <div className="card p-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Total Days:</span> <strong>{result.totalDays.toLocaleString()}</strong></div>
                <div><span className="text-gray-400">Total Weeks:</span> <strong>{Math.floor(result.totalDays / 7).toLocaleString()}</strong></div>
                <div><span className="text-gray-400">Total Months:</span> <strong>{(result.years * 12 + result.months).toLocaleString()}</strong></div>
                <div><span className="text-gray-400">Next Birthday:</span> <strong>{365 - result.days} days</strong></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
