"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

interface Semester { name: string; gpa: string; credits: string }

export default function CGPAPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { name: 'Semester 1', gpa: '', credits: '' },
    { name: 'Semester 2', gpa: '', credits: '' },
  ])
  const [cgpa, setCgpa] = useState<number | null>(null)

  const update = (i: number, field: keyof Semester, val: string) => {
    const copy = [...semesters]
    copy[i] = { ...copy[i], [field]: val }
    setSemesters(copy)
  }

  const addSemester = () => {
    setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, gpa: '', credits: '' }])
  }

  const removeSemester = (i: number) => {
    if (semesters.length <= 1) return
    setSemesters(semesters.filter((_, idx) => idx !== i))
  }

  const calculate = () => {
    let totalPoints = 0, totalCredits = 0
    for (const s of semesters) {
      const g = parseFloat(s.gpa), c = parseFloat(s.credits)
      if (!isNaN(g) && !isNaN(c) && c > 0) {
        totalPoints += g * c
        totalCredits += c
      }
    }
    if (totalCredits > 0) setCgpa(parseFloat((totalPoints / totalCredits).toFixed(2)))
  }

  return (
    <ToolLayout title="University CGPA Calculator" description="Calculate your cumulative GPA across multiple semesters.">
      <div className="max-w-2xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-4">Enter semester details</h2>
          <div className="space-y-3">
            {semesters.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={s.name} onChange={(e) => update(i, 'name', e.target.value)}
                  className="w-32 h-10 border border-gray-300 rounded-lg px-2 text-xs" />
                <input type="number" step="0.01" min="0" max="4" placeholder="GPA" value={s.gpa}
                  onChange={(e) => update(i, 'gpa', e.target.value)}
                  className="flex-1 h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                <input type="number" step="0.5" min="0" placeholder="Credits" value={s.credits}
                  onChange={(e) => update(i, 'credits', e.target.value)}
                  className="w-24 h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
                <button onClick={() => removeSemester(i)} className="text-red-400 hover:text-red-600 text-lg px-2">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addSemester} className="text-xs text-blue font-bold mt-3 hover:underline">+ Add Semester</button>
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setSemesters([{ name: 'Semester 1', gpa: '', credits: '' }]); setCgpa(null) }}
              className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
            <button onClick={calculate} className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold">Calculate CGPA</button>
          </div>
        </div>
        {cgpa !== null && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 text-center">
            <p className="text-sm opacity-80">Your CGPA</p>
            <p className="text-5xl font-extrabold mt-2">{cgpa.toFixed(2)}</p>
            <p className="text-xs opacity-70 mt-2">Out of 4.00</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
