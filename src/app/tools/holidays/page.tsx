"use client"
import ToolLayout from '@/components/ToolLayout'

const holidays2025 = [
  { date: 'Feb 21', name: 'International Mother Language Day', type: 'National' },
  { date: 'Mar 26', name: 'Independence Day', type: 'National' },
  { date: 'Mar 27', name: 'Shab-e-Qadr', type: 'Religious' },
  { date: 'Mar 28', name: 'Jumatul Wida', type: 'Religious' },
  { date: 'Mar 30', name: 'Eid ul-Fitr', type: 'Religious' },
  { date: 'Mar 31', name: 'Eid ul-Fitr (2nd day)', type: 'Religious' },
  { date: 'Apr 1', name: 'Eid ul-Fitr (3rd day)', type: 'Religious' },
  { date: 'Apr 14', name: 'Bengali New Year', type: 'National' },
  { date: 'May 1', name: 'May Day', type: 'National' },
  { date: 'May 1', name: 'Buddha Purnima', type: 'Religious' },
  { date: 'Jun 7', name: 'Eid ul-Adha', type: 'Religious' },
  { date: 'Jun 8', name: 'Eid ul-Adha (2nd day)', type: 'Religious' },
  { date: 'Jun 9', name: 'Eid ul-Adha (3rd day)', type: 'Religious' },
  { date: 'Jul 6', name: 'Ashura', type: 'Religious' },
  { date: 'Aug 15', name: 'National Mourning Day', type: 'National' },
  { date: 'Aug 26', name: 'Shab-e-Barat', type: 'Religious' },
  { date: 'Sep 5', name: 'Janmashtami', type: 'Religious' },
  { date: 'Sep 16', name: 'Eid-e-Milad-un-Nabi', type: 'Religious' },
  { date: 'Oct 2', name: 'Durga Puja (Bijoya Dashami)', type: 'Religious' },
  { date: 'Dec 16', name: 'Victory Day', type: 'National' },
  { date: 'Dec 25', name: 'Christmas Day', type: 'Religious' },
]

export default function HolidaysPage() {
  return (
    <ToolLayout title="Bangladesh Public Holidays 2025" description="Official public holidays in Bangladesh for the year 2025.">
      <div className="max-w-2xl mx-auto">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_100px] bg-white/5 border-b border-white/10 px-5 py-3 text-xs font-bold text-gray-300">
            <span>Date</span><span>Holiday</span><span className="text-right">Type</span>
          </div>
          {holidays2025.map((h, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr_100px] px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-white/5 text-sm items-center">
              <span className="text-xs text-gray-400">{h.date}</span>
              <span className="font-medium">{h.name}</span>
              <span className={`text-right text-xs font-semibold ${h.type === 'National' ? 'text-blue-600' : 'text-green-600'}`}>
                {h.type}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
          <p className="text-xs text-yellow-800">
            📌 Holiday dates may change based on moon sighting. Always verify with official government announcements.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
