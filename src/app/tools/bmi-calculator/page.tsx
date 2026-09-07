"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function BMICalculatorPage() {
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  const calculate = () => {
    const ft = parseFloat(heightFt) || 0
    const inches = parseFloat(heightIn) || 0
    const w = parseFloat(weight)
    
    const totalInches = ft * 12 + inches
    if (!totalInches || !w || totalInches <= 0 || w <= 0) return

    const heightInM = totalInches * 0.0254
    const weightInKg = weightUnit === 'kg' ? w : w * 0.453592

    const bmi = weightInKg / (heightInM * heightInM)

    let category = '', color = ''
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400' }
    else if (bmi < 25) { category = 'Normal'; color = 'text-green-400' }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-400' }
    else { category = 'Obese'; color = 'text-red-400' }

    setResult({ bmi: Math.round(bmi * 10) / 10, category, color })
  }

  return (
    <ToolLayout title="BMI Calculator" icon="⚖️" description="Calculate your Body Mass Index (BMI) instantly.">
      <TokenGate slug="bmi-calculator">
      <div className="max-w-xl mx-auto">
        <div className="card p-6 mb-4">
          {/* Height */}
          <div className="mb-6">
            <label className="text-xs text-gray-300 mb-2 block font-medium">📏 Height</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-gray-600" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">feet</span>
              </div>
              <div className="relative">
                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="7"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-gray-600" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">inches</span>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="mb-6">
            <label className="text-xs text-gray-300 mb-2 block font-medium">⚖️ Weight</label>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-gray-600" />
              <div className="flex gap-1">
                <button onClick={() => setWeightUnit('kg')}
                  className={`px-3 rounded-xl text-xs font-semibold transition ${weightUnit === 'kg' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400'}`}>
                  kg
                </button>
                <button onClick={() => setWeightUnit('lbs')}
                  className={`px-3 rounded-xl text-xs font-semibold transition ${weightUnit === 'lbs' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400'}`}>
                  lbs
                </button>
              </div>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary w-full">
            ⚖️ Calculate BMI
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="card p-6 text-center mb-4">
            <p className="text-sm text-gray-400 mb-2">Your BMI</p>
            <p className={`text-5xl font-extrabold ${result.color}`}>{result.bmi}</p>
            <p className={`text-lg font-semibold mt-2 ${result.color}`}>{result.category}</p>
          </div>
        )}

        {/* BMI Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-sm text-white mb-3">📊 BMI Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-blue-400">Underweight</span>
              <span className="text-xs text-gray-400">&lt; 18.5</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-green-400">Normal</span>
              <span className="text-xs text-gray-400">18.5 - 24.9</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-yellow-400">Overweight</span>
              <span className="text-xs text-gray-400">25 - 29.9</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-red-400">Obese</span>
              <span className="text-xs text-gray-400">&gt; 30</span>
            </div>
          </div>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
