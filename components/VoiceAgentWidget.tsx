'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'agent' | 'user'
  text: string
}

export default function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(28).fill(4))
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesRef = useRef<Message[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Keep messages ref in sync
  useEffect(() => { messagesRef.current = messages }, [messages])

  // Wave animation
  useEffect(() => {
    if (status === 'idle') { setWaveHeights(Array(28).fill(4)); return }
    let run = true
    const go = () => {
      if (!run) return
      const t = Date.now()
      setWaveHeights(Array(28).fill(0).map((_, i) => {
        if (status === 'processing') return 4 + Math.abs(Math.sin(t / 300 + i * 0.5)) * 12
        const b = status === 'listening' ? 8 : 12
        const a = status === 'listening' ? 22 : 30
        return b + Math.abs(Math.sin(t / 110 + i * 0.7)) * a + Math.random() * 8
      }))
      animRef.current = requestAnimationFrame(go)
    }
    go()
    return () => { run = false; cancelAnimationFrame(animRef.current) }
  }, [status])

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  // --- Core functions (no useCallback to avoid stale closures) ---

  async function speakText(text: string): Promise<void> {
    setStatus('speaking')
    try {
      const res = await fetch(`${API_URL}/api/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (res.ok) {
        const blob = await res.blob()
        if (blob.size > 200) {
          await new Promise<void>((resolve) => {
            const url = URL.createObjectURL(blob)
            const audio = new Audio(url)
            audioRef.current = audio
            audio.onended = () => { URL.revokeObjectURL(url); resolve() }
            audio.onerror = () => { URL.revokeObjectURL(url); resolve() }
            audio.play().catch(() => resolve())
          })
          setStatus('idle')
          return
        }
      }
    } catch (e) {
      console.log('ElevenLabs TTS failed, using browser:', e)
    }

    // Browser fallback
    await new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text)
      const voices = speechSynthesis.getVoices()
      const v = voices.find(v => v.name.includes('Samantha') || v.lang === 'en-US')
      if (v) u.voice = v
      u.onend = () => resolve()
      u.onerror = () => resolve()
      speechSynthesis.speak(u)
    })
    setStatus('idle')
  }

  async function getAIResponse(text: string): Promise<string> {
    const history = messagesRef.current.map(m => ({
      role: m.role === 'agent' ? 'assistant' : 'user',
      content: m.text,
    }))
    try {
      const res = await fetch(`${API_URL}/api/voice/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      return data.response || "Sorry, could you say that again?"
    } catch {
      return "I'm having trouble connecting. One moment please."
    }
  }

  function listen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Please use Chrome or Edge for voice features.')
      return
    }

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      console.log('Speech recognition started')
      setStatus('listening')
    }

    recognition.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript
      console.log('Got transcript:', transcript)

      if (!transcript?.trim()) {
        setStatus('idle')
        return
      }

      // Process the conversation turn
      setStatus('processing')
      setMessages(prev => [...prev, { role: 'user', text: transcript }])

      const aiText = await getAIResponse(transcript)
      setMessages(prev => [...prev, { role: 'agent', text: aiText }])

      await speakText(aiText)

      // Auto-listen again after AI finishes speaking
      setTimeout(() => listen(), 400)
    }

    recognition.onerror = (event: any) => {
      console.log('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow it in browser settings and try again.')
      }
      setStatus('idle')
    }

    recognition.onend = () => {
      console.log('Speech recognition ended, current status will be checked')
      // Don't auto-restart here — onresult handles the flow
    }

    try {
      recognition.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setStatus('idle')
    }
  }

  function stopAll() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    speechSynthesis.cancel()
    setStatus('idle')
  }

  function handleMicClick() {
    console.log('Mic clicked, status:', status)
    if (status === 'listening') {
      stopAll()
    } else if (status === 'speaking') {
      stopAll()
      setTimeout(() => listen(), 300)
    } else if (status === 'idle') {
      listen()
    }
  }

  async function handleStart() {
    setIsOpen(true)
    if (messagesRef.current.length === 0) {
      const greeting = "Hi there! I'm Sarah from PayVital. I'm here to help with medical bills, payments, or payment plans. Just tap the mic and ask me anything!"
      setMessages([{ role: 'agent', text: greeting }])
      await speakText(greeting)
    }
  }

  // --- Closed state ---
  if (!isOpen) {
    return (
      <button
        onClick={handleStart}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-primary to-emerald-500 text-white px-6 py-3.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
      >
        <div className="relative">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <span className="font-semibold text-[14px]">Talk to AI Agent</span>
        <div className="flex items-center gap-[2px] ml-1">
          {[8, 14, 10, 16, 8].map((h, i) => (
            <div key={i} className="w-[2px] bg-white/60 rounded-full animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </button>
    )
  }

  // --- Open state ---
  const colors: Record<string, string> = { idle: '#34d399', listening: '#60a5fa', processing: '#fbbf24', speaking: '#34d399' }
  const labels: Record<string, string> = { idle: 'Tap mic to talk', listening: 'Listening...', processing: 'Thinking...', speaking: 'Sarah is speaking...' }
  const waveClass: Record<string, string> = {
    idle: 'bg-white/10',
    listening: 'bg-gradient-to-t from-blue-400 to-cyan-300',
    processing: 'bg-gradient-to-t from-yellow-400 to-orange-300',
    speaking: 'bg-gradient-to-t from-primary to-emerald-400',
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="bg-[#0a0f1e]/95 backdrop-blur-xl rounded-[24px] border border-white/10 overflow-hidden shadow-2xl shadow-primary/20">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0f1e]" style={{ backgroundColor: colors[status] }}>
                {status !== 'idle' && <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: colors[status] }} />}
              </span>
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">Sarah — PayVital AI</p>
              <p className="text-[11px] font-medium" style={{ color: colors[status] }}>{labels[status]}</p>
            </div>
          </div>
          <button onClick={() => { stopAll(); setIsOpen(false) }} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Waveform */}
        <div className="px-5 py-4 flex items-center justify-center">
          <div className="flex items-center gap-[3px] h-14">
            {waveHeights.map((h, i) => (
              <div key={i} className={`w-[3px] rounded-full transition-all duration-100 ${waveClass[status]}`} style={{ height: `${h}px` }} />
            ))}
          </div>
        </div>

        {/* Transcript */}
        {messages.length > 0 && (
          <div ref={scrollRef} className="px-5 pb-3 max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="space-y-2.5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${msg.role === 'agent' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>
                    {msg.role === 'agent' ? 'AI' : 'You'}
                  </div>
                  <div className={`text-[12px] leading-relaxed px-3 py-2 rounded-2xl max-w-[85%] ${msg.role === 'agent' ? 'bg-white/5 text-white/80 rounded-tl-sm' : 'bg-primary/15 text-white/80 rounded-tr-sm'}`}>
                    {msg.text.replace(/\[.*?\]/g, '').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mic button */}
        <div className="px-5 py-4 flex flex-col items-center gap-3">
          <button
            onClick={handleMicClick}
            disabled={status === 'processing'}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              status === 'listening' ? 'bg-red-500 shadow-lg shadow-red-500/40 scale-110'
                : status === 'speaking' ? 'bg-primary shadow-lg shadow-primary/40 scale-105'
                : status === 'processing' ? 'bg-yellow-500/20 cursor-wait'
                : 'bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95'
            }`}
          >
            {status === 'listening' ? (
              <div className="w-5 h-5 bg-white rounded-sm" />
            ) : status === 'processing' ? (
              <svg className="w-7 h-7 text-white/40 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          <p className="text-[11px] text-white/30">
            {status === 'listening' ? 'Listening... speak now' : status === 'speaking' ? 'Tap to interrupt' : status === 'processing' ? 'Processing...' : 'Tap to start talking'}
          </p>
        </div>

        {/* Bottom */}
        <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-white/40">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] text-white/40">PCI Secure</span>
            </div>
          </div>
          <span className="text-[10px] text-white/25">ElevenLabs v3 + GPT-5.4</span>
        </div>
      </div>
    </div>
  )
}
