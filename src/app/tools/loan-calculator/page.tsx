"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState('100000')
  const [rate, setRate] = useState('10')
  const [years, setYears] = useState('5')
  const [result, setResult] = useState<{
    emi: number; totalPayment: number; totalInterest: number
  } | null>(null)

  const calculate = () => {
    const P = parseFloat(amount)
    const R = parseFloat(rate) / 12 / 100
    const N = parseFloat(years) * 12

    if (!P || !R || !N) return

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
    const totalPayment = emi * N
    const totalInterest = totalPayment - P

    setResult({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    })
  }

  const formatNum = (n: number) => n.toLocaleString('en-BD')

  return (
    <ToolLayout title="Loan EMI Calculator" icon="💰" description="Calculate your monthly EMI, total interest, and payment schedule.">
      <div className="max-w-xl mx-auto">
        <div className="card p-6 mb-4">
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Loan Amount (৳)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Interest Rate (% per year)</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Loan Term (years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white" />
            </div>
          </div>

          <button onClick={calculate} className="btn-primary w-full">
            Calculate EMI
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="card p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Monthly EMI</p>
              <p className="text-4xl font-extrabold text-blue-400">৳ {formatNum(result.emi)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5 text-center">
                <p className="text-xs text-gray-400 mb-1">Total Payment</p>
                <p className="text-xl font-bold text-white">৳ {formatNum(result.totalPayment)}</p>
              </div>
              <div className="card p-5 text-center">
                <p className="text-xs text-gray-400 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-red-400">৳ {formatNum(result.totalInterest)}</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="card p-5">
              <h3 className="font-bold text-sm text-white mb-3">📊 Breakdown</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(parseFloat(amount) / result.totalPayment) * 100}%` }} />
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded"></span>
                    Principal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    Interest
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
