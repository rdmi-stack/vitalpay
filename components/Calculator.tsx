'use client'

import { useState, useCallback } from 'react'

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export default function Calculator() {
  const [bills, setBills] = useState(1000)
  const [rate, setRate] = useState(50)
  const [avg, setAvg] = useState(125)

  const totalBillable = bills * avg
  const currentCol = totalBillable * (rate / 100)
  const uncollected = totalBillable - currentCol
  const ppAdditional = uncollected * 0.5
  const ppCollected = currentCol + ppAdditional
  const hours = Math.round((bills * 3.4) / 60)
  const hoursVal = hours * 19.84
  const paper = bills * 0.475
  const badDebtVal = uncollected * 0.0495
  const totalSavings = ppAdditional + hoursVal + paper + badDebtVal

  const handleBills = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBills(parseInt(e.target.value))
  }, [])
  const handleRate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseInt(e.target.value))
  }, [])
  const handleAvg = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAvg(parseInt(e.target.value))
  }, [])

  const sliders = [
    { id: 'bills-sent', label: 'Monthly Patient Bills Sent', min: 100, max: 10000, step: 100, value: bills, onChange: handleBills, display: bills.toLocaleString('en-US') },
    { id: 'collection-rate', label: 'Current Collection Rate', min: 10, max: 90, step: 1, value: rate, onChange: handleRate, display: `${rate}%` },
    { id: 'avg-bill', label: 'Average Bill Amount', min: 25, max: 500, step: 5, value: avg, onChange: handleAvg, display: `$${avg}` },
  ]

  const results = [
    { label: 'Additional Revenue Collected', value: fmt(ppAdditional), highlight: true },
    { label: 'Total Monthly Collections', value: fmt(ppCollected), highlight: false },
    { label: 'Staff Hours Recovered', value: `${hours} hrs`, highlight: false },
    { label: 'Staff Cost Savings', value: fmt(hoursVal), highlight: false },
    { label: 'Paper Statement Savings', value: fmt(paper), highlight: false },
    { label: 'Bad Debt Reduction', value: fmt(badDebtVal), highlight: false },
  ]

  return (
    <section id="calculator" aria-labelledby="calculator-heading" className="py-24 lg:py-32 bg-brand-50">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-[3px] bg-primary rounded-full" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">ROI Calculator</span>
            <span className="w-10 h-[3px] bg-primary rounded-full" />
          </div>
          <h2 id="calculator-heading" className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-brand-dark mb-4">
            See what PayVital can do for you
          </h2>
          <p className="text-[16px] text-brand-500 max-w-[560px] mx-auto leading-relaxed">
            Adjust the sliders to match your practice and see your potential savings in real time.
          </p>
        </div>

        {/* Calculator card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-xl border border-brand-100 overflow-hidden max-w-[1000px] mx-auto">
          {/* Left: Sliders */}
          <div className="lg:col-span-2 p-8 lg:p-10 bg-brand-dark">
            <h3 className="text-lg font-bold text-white mb-1">Your Practice</h3>
            <p className="text-sm text-white/50 mb-8">Adjust to match your current metrics</p>

            <fieldset className="border-none p-0 m-0 flex flex-col gap-8">
              <legend className="sr-only">Adjust your current billing metrics</legend>
              {sliders.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor={s.id} className="text-[13px] font-medium text-white/70">
                      {s.label}
                    </label>
                    <span className="text-[15px] font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                      {s.display}
                    </span>
                  </div>
                  <input
                    id={s.id}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    onChange={s.onChange}
                    className="w-full accent-primary"
                  />
                </div>
              ))}
            </fieldset>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 p-8 lg:p-10">
            <h3 className="text-lg font-bold text-brand-dark mb-1">Your Potential with PayVital</h3>
            <p className="text-sm text-brand-500 mb-8">Estimated monthly impact</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {results.map((r) => (
                <div
                  key={r.label}
                  className={`rounded-2xl p-4 ${r.highlight ? 'bg-primary text-white col-span-2' : 'bg-brand-50'}`}
                >
                  <p className={`text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-none mb-1 ${r.highlight ? 'text-white' : 'text-brand-dark'}`}>
                    {r.value}
                  </p>
                  <p className={`text-[13px] ${r.highlight ? 'text-white/80' : 'text-brand-500'}`}>
                    {r.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-brand-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-brand-500 mb-1">Total estimated monthly impact</p>
                <p className="text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold text-primary leading-none">
                  {fmt(totalSavings)}
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-[15px] px-7 py-3.5 rounded-full transition-all shrink-0"
              >
                Get started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
