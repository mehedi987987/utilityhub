"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

const gradePoints: Record<string, number> = {
  'A+': 5.0, 'A': 4.0, 'A-': 3.5, 'B': 3.0, 'B-': 2.5, 'C': 2.0, 'D': 1.0, 'F': 0,
}

const subjects = [
  { name: 'Bangla', code: 'BAN' },
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Science', code: 'SCI' },
  { name: 'Social Science', code: 'SOC' },
  { name: 'Religion', code: 'REL' },
  { name: 'ICT', code: 'ICT' },
]

export default function SSCGPAPage() {
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [gpa, setGpa] = useState<number | null>(null)

  const setGrade = (subject: string, grade: string) => {
    setGrades(prev => ({ ...prev, [subject]: grade }))
  }

  const calculate = () => {
    const values = Object.values(grades).filter(g => g)
    if (values.length === 0) return
    const total = values.reduce((sum, g) => sum + (gradePoints[g] || 0), 0)
    setGpa(parseFloat((total / values.length).toFixed(2)))
  }

  const reset = () => {
    setGrades({})
    setGpa(null)
  }

  return (
    <ToolLayout title="SSC GPA Calculator" description="Calculate your SSC GPA based on the Bangladesh education grading system.">
      <TokenGate slug="ssc-gpa">
      <div className="max-w-2xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-4">Enter your grades</h2>
          <div className="space-y-3">
            {subjects.map((sub) => (
              <div key={sub.code} className="flex items-center gap-3">
                <span className="w-24 text-xs font-semibold text-white">{sub.name}</span>
                <select
                  value={grades[sub.code] || ''}
                  onChange={(e) => setGrade(sub.code, e.target.value)}
                  className="flex-1 h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white bg-white"
                >
                  <option value="">Select grade</option>
                  {Object.keys(gradePoints).map(g => (
                    <option key={g} value={g}>{g} ({gradePoints[g]})</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={reset} className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
            <button onClick={calculate} className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold">Calculate GPA</button>
          </div>
        </div>

        {gpa !== null && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 text-center">
            <p className="text-sm opacity-80">Your SSC GPA</p>
            <p className="text-5xl font-extrabold mt-2">{gpa.toFixed(2)}</p>
            <p className="text-xs opacity-70 mt-2">Out of 5.00</p>
          </div>
        )}

        <div className="card p-5 mt-4">
          <h3 className="text-sm font-bold mb-2">Grading Scale</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {Object.entries(gradePoints).map(([grade, point]) => (
              <div key={grade} className="flex justify-between bg-white/5 px-3 py-2 rounded">
                <span className="font-semibold">{grade}</span><span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
