"use client"
import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function CountdownPage() {
  const [target, setTarget] = useState('')
  const [label, setLabel] = useState('')
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      if (!target) return
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) {
        setRunning(false)
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, target])

  const start = () => {
    if (!target) return
    setRunning(true)
  }

  return (
    <ToolLayout title="Countdown Timer" description="Set a countdown to any date and time.">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Label (optional)</label>
              <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Birthday, Exam..."
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Target Date & Time</label>
              <input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)}
                className="w-full h-12 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setRunning(false); setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }) }}
              className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
            <button onClick={start} className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold">Start Countdown</button>
          </div>
        </div>

        {running && (
          <div>
            {label && <p className="text-center text-sm font-semibold text-gray-300 mb-3">⏱️ {label}</p>}
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: time.days, label: 'Days' },
                { val: time.hours, label: 'Hours' },
                { val: time.minutes, label: 'Minutes' },
                { val: time.seconds, label: 'Seconds' },
              ].map((t) => (
                <div key={t.label} className="bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-xl p-5 text-center">
                  <p className="text-3xl font-extrabold">{String(t.val).padStart(2, '0')}</p>
                  <p className="text-xs opacity-80 mt-1">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
