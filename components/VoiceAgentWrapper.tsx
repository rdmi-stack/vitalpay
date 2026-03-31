'use client'

import dynamic from 'next/dynamic'

const VoiceAgentWidget = dynamic(() => import('./VoiceAgentWidget'), {
  ssr: false,
  loading: () => (
    <button className="flex items-center gap-3 bg-gradient-to-r from-[#635bff] to-[#10b981] text-white px-6 py-3.5 rounded-full shadow-lg opacity-70">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
      <span className="font-semibold text-[14px]">Loading AI Agent...</span>
    </button>
  ),
})

export default function VoiceAgentWrapper() {
  return <VoiceAgentWidget />
}
