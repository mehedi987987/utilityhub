"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

// Simple Hijri approximation
function gregorianToHijri(year: number, month: number, day: number) {
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5
  const l = Math.floor(jd - 1948439.5 + 10632) / 10631
  const n = Math.floor(l)
  const j = jd - 1948439.5 + 10632 - Math.floor(10631 * n) + 354
  const k = Math.floor((j - 1) / 10631)
  const j2 = j - 10631 * k + 354
  const k2 = Math.floor((10985 - j2) / 5316) * Math.floor((50 * j2) / 177195) + Math.floor(j2 / 5670) * Math.floor((43 * j2) / 152380)
  const j3 = j2 - Math.floor((30 - k2) / 15) * Math.floor((17719 * k2) / 50) - Math.floor(k2 / 16) * Math.floor((15238 * k2) / 43) + 29
  const hm = Math.floor((24 * j3) / 709)
  const hd = j3 - Math.floor((709 * hm) / 24)
  const hy = 30 * n + k - 30
  return { year: hy, month: hm, day: hd }
}

const hijriMonths = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul Qi\'dah', 'Dhul Hijjah']

export default function IslamicDatePage() {
  const today = new Date()
  const [date, setDate] = useState(today.toISOString().split('T')[0])
  const [result, setResult] = useState<ReturnType<typeof gregorianToHijri> | null>(null)

  const convert = () => {
    const [y, m, d] = date.split('-').map(Number)
    setResult(gregorianToHijri(y, m, d))
  }

  // Auto-convert on load
  useState(() => { convert() })

  return (
    <ToolLayout title="Islamic Date Converter" description="Convert Gregorian dates to Hijri (Islamic) calendar dates.">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-3">Select Gregorian Date</h2>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white mb-3" />
          <button onClick={convert} className="w-full bg-blue text-white py-3 rounded-xl text-sm font-bold">Convert to Hijri</button>
        </div>

        {result && (
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6 text-center">
            <p className="text-sm opacity-80">Hijri Date</p>
            <p className="text-3xl font-extrabold mt-2">{result.day} {hijriMonths[result.month - 1] || ''} {result.year}</p>
            <p className="text-xs opacity-70 mt-2">AH (After Hijra)</p>
          </div>
        )}

        <div className="card p-5 mt-4">
          <h3 className="text-sm font-bold mb-2">Today</h3>
          <p className="text-xs text-gray-300">
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
