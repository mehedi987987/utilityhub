"use client"
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import TokenGate from '@/components/TokenGate'

export default function ZakatPage() {
  const [gold, setGold] = useState('')
  const [silver, setSilver] = useState('')
  const [cash, setCash] = useState('')
  const [investments, setInvestments] = useState('')
  const [debts, setDebts] = useState('')
  const [result, setResult] = useState<{ total: number; zakat: number } | null>(null)

  const calculate = () => {
    const totalWealth = (parseFloat(gold) || 0) + (parseFloat(silver) || 0) + (parseFloat(cash) || 0) + (parseFloat(investments) || 0) - (parseFloat(debts) || 0)
    const nisab = 87.48 * 85 // ~87.48g gold price approx
    if (totalWealth >= nisab) {
      setResult({ total: totalWealth, zakat: totalWealth * 0.025 })
    } else {
      setResult({ total: totalWealth, zakat: 0 })
    }
  }

  const formatNum = (n: number) => n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <ToolLayout title="Zakat Calculator" description="Estimate your Zakat obligation based on your total wealth.">
      <TokenGate slug="zakat">
      <div className="max-w-xl mx-auto">
        <div className="card p-5 mb-4">
          <h2 className="text-sm font-bold mb-4">Enter your wealth (in BDT)</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Gold Value</label>
              <input type="number" value={gold} onChange={(e) => setGold(e.target.value)} placeholder="0"
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Silver Value</label>
              <input type="number" value={silver} onChange={(e) => setSilver(e.target.value)} placeholder="0"
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Cash & Bank Balance</label>
              <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} placeholder="0"
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Investments & Business</label>
              <input type="number" value={investments} onChange={(e) => setInvestments(e.target.value)} placeholder="0"
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Debts Owed (subtract)</label>
              <input type="number" value={debts} onChange={(e) => setDebts(e.target.value)} placeholder="0"
                className="w-full h-10 border border-white/10 rounded-lg px-3 text-sm bg-white/5 text-white" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setGold(''); setSilver(''); setCash(''); setInvestments(''); setDebts(''); setResult(null) }}
              className="flex-1 border border-gray-300 bg-white text-white py-3 rounded-xl text-sm font-bold">Reset</button>
            <button onClick={calculate} className="flex-1 bg-blue text-white py-3 rounded-xl text-sm font-bold">Calculate Zakat</button>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="card p-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Total Wealth</span>
                <span className="text-lg font-bold">৳ {formatNum(result.total)}</span>
              </div>
            </div>
            <div className={`rounded-xl p-6 text-center ${result.zakat > 0 ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' : 'bg-white/10 text-gray-300'}`}>
              <p className="text-sm opacity-80">Zakat Due (2.5%)</p>
              <p className="text-4xl font-extrabold mt-2">৳ {formatNum(result.zakat)}</p>
              {result.zakat === 0 && <p className="text-xs mt-2">Your wealth is below Nisab threshold</p>}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
          <p className="text-xs text-yellow-800">
            ⚠️ This is an estimate. Consult a qualified Islamic scholar for precise Zakat calculations. Nisab values change with gold/silver prices.
          </p>
        </div>
      </div>
          </TokenGate>
    </ToolLayout>
  )
}
