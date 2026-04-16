import { useEffect, useMemo, useRef, useState } from 'react'

function formatTime(d = new Date()) {
  return d.toLocaleTimeString([], { hour12: false })
}

function formatDuration(totalSeconds) {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function clampLog(lines, maxLines) {
  if (lines.length <= maxLines) return lines
  return lines.slice(lines.length - maxLines)
}

function findFirstHttpUrl(value, depth = 0) {
  if (depth > 6) return null
  if (!value) return null
  if (typeof value === 'string') {
    return value.startsWith('http') ? value : null
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstHttpUrl(item, depth + 1)
      if (found) return found
    }
    return null
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) {
      const found = findFirstHttpUrl(v, depth + 1)
      if (found) return found
    }
  }
  return null
}

function useAutoScroll(dep) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [dep])

  return ref
}

function AppHeader({ systemActive }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-soft-cyan/20 bg-deep-purple/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-soft-lilac/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-soft-cyan/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-soft-mint/70" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs tracking-[0.22em] uppercase text-soft-lilac/80">
            DevQuest
          </span>
          <span className="text-xs text-soft-lilac/40">//</span>
          <span className="text-xs tracking-[0.22em] uppercase text-soft-cyan/80">
            System Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={[
            'h-2 w-2 rounded-full shadow-[0_0_12px_rgba(45,212,191,0.75)]',
            systemActive ? 'bg-soft-mint' : 'bg-soft-lilac/40',
          ].join(' ')}
          aria-hidden="true"
        />
        <span className="text-[0.7rem] tracking-[0.22em] text-soft-cyan/80">
          {systemActive ? 'ONLINE' : 'IDLE'}
        </span>
      </div>
    </header>
  )
}

function ControlPanel({
  systemActive,
  setSystemActive,
  onEmit,
  onClear,
  maxLines,
  setMaxLines,
  mood,
  setMood,
  remainingSeconds,
  brainDump,
  setBrainDump,
  isExorcising,
  onExorcize,
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-soft-cyan/15 bg-deep-purple/40/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.7)] backdrop-blur-xl">
        <div className="mb-3 text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
          MOOD // STATUS
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            className={[
              'rounded-xl border px-2 py-2 text-[0.7rem] font-medium transition',
              mood === 'chaos'
                ? 'border-red-400/70 bg-red-500/15 text-red-100 shadow-[0_0_24px_rgba(248,113,113,0.55)]'
                : 'border-soft-cyan/30 bg-soft-ink/80 text-soft-lilac hover:bg-red-500/10 hover:border-red-400/60',
            ].join(' ')}
            onClick={() => setMood('chaos')}
          >
            High Energy
            <span className="block text-[0.65rem] text-soft-lilac/70">
              / Chaos
            </span>
          </button>

          <button
            type="button"
            className={[
              'rounded-xl border px-2 py-2 text-[0.7rem] font-medium transition',
              mood === 'melancholy'
                ? 'border-violet-400/70 bg-violet-500/15 text-soft-lilac shadow-[0_0_24px_rgba(167,139,250,0.55)]'
                : 'border-soft-cyan/30 bg-soft-ink/80 text-soft-lilac hover:bg-violet-500/10 hover:border-violet-400/60',
            ].join(' ')}
            onClick={() => setMood('melancholy')}
          >
            Low Energy
            <span className="block text-[0.65rem] text-soft-lilac/70">
              / Melancholy
            </span>
          </button>

          <button
            type="button"
            className={[
              'rounded-xl border px-2 py-2 text-[0.7rem] font-medium transition',
              mood === 'reset'
                ? 'border-soft-cyan/60 bg-soft-ink text-soft-cyan shadow-[0_0_24px_rgba(148,163,184,0.65)]'
                : 'border-soft-cyan/30 bg-soft-ink/80 text-soft-lilac hover:bg-soft-ink hover:border-soft-cyan/60',
            ].join(' ')}
            onClick={() => setMood('reset')}
          >
            Crisis
            <span className="block text-[0.65rem] text-soft-lilac/70">
              / Reset
            </span>
          </button>
        </div>

        {mood === 'chaos' && (
          <div className="rounded-xl border border-red-400/40 bg-black/30 px-3 py-2 text-[0.7rem] text-red-100/90">
            <div className="mb-1 flex items-center justify-between">
              <span className="tracking-[0.18em] uppercase">
                Pomodoro // 25:00
              </span>
              <span className="font-mono text-sm">
                {formatDuration(remainingSeconds || 25 * 60)}
              </span>
            </div>
            <p className="text-[0.68rem] text-red-100/80">
              Focus run. Nada de pestañas extra, solo una misión.
            </p>
          </div>
        )}

        {mood === 'melancholy' && (
          <div className="space-y-2 rounded-xl border border-violet-400/40 bg-soft-ink/60 px-3 py-2 text-[0.7rem] text-soft-lilac">
            <p className="italic text-soft-lilac/90">
              “Those who turn their hands against their comrades are sure to die
              a terrible death.” — Itachi Uchiha
            </p>
          </div>
        )}

        <div className="mb-3 text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
          CONTROL PANEL
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-xs font-medium text-soft-cyan hover:bg-soft-cyan/10 focus:outline-none focus:ring-2 focus:ring-soft-cyan/40"
            onClick={() => setSystemActive((v) => !v)}
          >
            {systemActive ? 'Set Standby' : 'Set Online'}
          </button>

          <button
            type="button"
            className="rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-xs font-medium text-soft-lilac hover:bg-soft-lilac/10 focus:outline-none focus:ring-2 focus:ring-soft-lilac/40"
            onClick={() =>
              onEmit('Manual ping', {
                level: 'INFO',
                detail: 'Heartbeat check requested by operator.',
              })
            }
          >
            Ping
          </button>

          <button
            type="button"
            className="rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-xs font-medium text-soft-mint hover:bg-soft-mint/10 focus:outline-none focus:ring-2 focus:ring-soft-mint/40"
            onClick={() =>
              onEmit('Scan cycle', {
                level: 'WARN',
                detail: 'Port scan initiated (simulated).',
              })
            }
          >
            Run Scan
          </button>

          <button
            type="button"
            className="rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-xs font-medium text-soft-lilac/80 hover:bg-soft-lilac/10 focus:outline-none focus:ring-2 focus:ring-soft-lilac/40"
            onClick={onClear}
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-soft-cyan/15 bg-deep-purple/40/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.7)] backdrop-blur-xl">
        <div className="mb-3 text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
          CONSOLE SETTINGS
        </div>

        <label className="flex items-center justify-between gap-4">
          <span className="text-xs text-soft-lilac/80">Max lines</span>
          <input
            type="number"
            min={50}
            max={2000}
            value={maxLines}
            onChange={(e) => setMaxLines(Number(e.target.value || 0))}
            className="w-24 rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-2 py-1 text-xs text-soft-lilac outline-none focus:ring-2 focus:ring-soft-cyan/40"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-soft-cyan/15 bg-deep-purple/40/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.7)] backdrop-blur-xl">
        <div className="mb-3 text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
          BRAIN DUMP
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              placeholder="Suelta aqui lo que te esta quemando el cerebro..."
              disabled={isExorcising}
              className={[
                'min-h-32 w-full resize-none rounded-2xl border border-soft-cyan/25 bg-soft-ink/80 px-3 py-3 text-xs text-soft-lilac outline-none transition focus:ring-2 focus:ring-soft-cyan/40',
                isExorcising ? 'animate-smoke-away' : '',
              ].join(' ')}
            />
          </div>

          <button
            type="button"
            onClick={onExorcize}
            disabled={!brainDump.trim() || isExorcising}
            className="w-full rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-xs font-medium text-soft-cyan hover:bg-soft-cyan/10 focus:outline-none focus:ring-2 focus:ring-soft-cyan/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExorcising ? 'Exorcizando...' : 'Exorcizar'}
          </button>
        </div>
      </div>
    </section>
  )
}

function ActivityLog({ lines }) {
  const scrollerRef = useAutoScroll(lines.length)

  return (
    <section className="rounded-2xl border border-soft-cyan/20 bg-soft-ink/90 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-soft-cyan/15 bg-deep-purple/40 px-4 py-3">
        <div className="text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
          ACTIVITY LOG
        </div>
        <div className="text-[0.7rem] text-soft-cyan/70">{lines.length} lines</div>
      </div>

      <div
        ref={scrollerRef}
        className="h-[420px] overflow-auto px-4 py-3 text-xs leading-6 text-soft-lilac/90"
      >
        <pre className="whitespace-pre-wrap break-words">
          {lines.length ? lines.join('\n') : '… awaiting events …'}
        </pre>
      </div>
    </section>
  )
}

function MoodVisual({ mood, imageUrl, imageLoading, imageError, onRefresh }) {
  const moodLabel =
    mood === 'chaos'
      ? 'High Energy / Chaos'
      : mood === 'melancholy'
      ? 'Low Energy / Melancholy'
      : 'Neutral / Drift'

  return (
    <section className="rounded-2xl border border-soft-cyan/20 bg-soft-ink/90 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-soft-cyan/15 bg-deep-purple/40 px-4 py-3">
        <div>
          <div className="text-[0.7rem] tracking-[0.22em] text-soft-lilac/80">
            MOOD VISUAL
          </div>
          <div className="mt-1 text-[0.68rem] text-soft-cyan/70">{moodLabel}</div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-soft-cyan/30 bg-soft-ink/80 px-3 py-2 text-[0.68rem] font-medium text-soft-cyan hover:bg-soft-cyan/10 focus:outline-none focus:ring-2 focus:ring-soft-cyan/40"
        >
          Refresh
        </button>
      </div>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-soft-cyan/15 bg-black/40">
          {imageLoading && (
            <div className="flex aspect-[4/5] items-center justify-center text-xs text-soft-lilac/70">
              Invocando imagen anime...
            </div>
          )}

          {!imageLoading && imageError && (
            <div className="flex aspect-[4/5] items-center justify-center px-6 text-center text-xs text-soft-lilac/70">
              No se pudo cargar la imagen.
              <div className="mt-2 text-[0.68rem] text-soft-cyan/70">
                {imageError}
              </div>
            </div>
          )}

          {!imageLoading && !imageError && imageUrl && (
            <img
              src={imageUrl}
              alt={`Mood visual ${moodLabel}`}
              className="goth-anime-image aspect-[4/5] w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [systemActive, setSystemActive] = useState(true)
  const [maxLines, setMaxLines] = useState(400)
  const [lines, setLines] = useState(() => [
    `[${formatTime()}] [BOOT] DevQuest node initialized.`,
    `[${formatTime()}] [OK] Tailwind theme loaded.`,
    `[${formatTime()}] [OK] Channel ready.`,
  ])
  const [mood, setMood] = useState('neutral')
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [brainDump, setBrainDump] = useState('')
  const [isExorcising, setIsExorcising] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState('')
  const [imageSeed, setImageSeed] = useState(0)

  const autoMessages = useMemo(
    () => [
      { level: 'OK', text: 'Handshake verified.' },
      { level: 'INFO', text: 'Sync pulse received.' },
      { level: 'INFO', text: 'Caching glyphs.' },
      { level: 'WARN', text: 'Anomaly noise detected (benign).' },
      { level: 'OK', text: 'Subsystem stable.' },
      { level: 'INFO', text: 'Telemetry buffered.' },
    ],
    [],
  )

  const emit = (label, meta) => {
    const level = meta?.level ?? 'INFO'
    const detail = meta?.detail ? ` ${meta.detail}` : ''
    const next = `[${formatTime()}] [${level}] ${label}.${detail}`
    setLines((prev) => clampLog([...prev, next], maxLines))
  }

  const clear = () => {
    setLines([`[${formatTime()}] [OK] Log cleared by operator.`])
  }

  const handleExorcize = () => {
    if (!brainDump.trim() || isExorcising) return

    setIsExorcising(true)

    window.setTimeout(() => {
      setBrainDump('')
      setIsExorcising(false)
      emit('Pensamiento eliminado del sistema', { level: 'OK' })
    }, 700)
  }

  const refreshMoodImage = () => {
    setImageSeed((prev) => prev + 1)
  }

  // Auto-log stream
  useEffect(() => {
    if (!systemActive) return

    const id = window.setInterval(() => {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)]
      const next = `[${formatTime()}] [${msg.level}] ${msg.text}`
      setLines((prev) => clampLog([...prev, next], maxLines))
    }, 1100)

    return () => window.clearInterval(id)
  }, [autoMessages, maxLines, systemActive])

  // Pomodoro 25 min para High Energy / Chaos
  useEffect(() => {
    if (mood !== 'chaos') {
      setRemainingSeconds(25 * 60)
      return
    }

    const total = 25 * 60
    const start = Date.now()

    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000)
      const remaining = Math.max(0, total - elapsed)
      setRemainingSeconds(remaining)
      if (remaining <= 0) {
        window.clearInterval(id)
        emit('Pomodoro complete', {
          level: 'OK',
          detail: 'Take a break, dark hero.',
        })
      }
    }, 1000)

    return () => window.clearInterval(id)
  }, [mood])

  useEffect(() => {
    let cancelled = false

    const tagsByMood = {
      neutral: ['Catgirl', 'Illustration'],
      chaos: ['Girl', 'Weapon', 'Red hair'],
      melancholy: ['Girl', 'Night', 'Purple hair'],
      reset: ['Girl', 'Night'],
    }

    async function loadMoodImage() {
      setImageLoading(true)
      setImageError('')

      try {
        const tags = (tagsByMood[mood] ?? tagsByMood.neutral)
        const tagsParam = tags.map((t) => encodeURIComponent(t)).join(',')

        const tryFetch = async (url) => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`bad-status:${res.status}`)
          return await res.json()
        }

        // 1) Intento con tags del mood
        let data = await tryFetch(
          `/nekos/v4/images/random?limit=1&rating=safe&tags=${tagsParam}`,
        )

        // 2) Si viene vacío o no hay URL, reintenta sin tags (random safe)
        const pickFirst = (payload) =>
          Array.isArray(payload)
            ? payload[0]
            : payload?.items?.[0] ?? payload?.data?.[0] ?? payload

        let first = pickFirst(data)
        let url =
          first?.url ??
          first?.image_url ??
          first?.image?.url ??
          first?.file ??
          first?.file_url ??
          findFirstHttpUrl(first)

        if (!url) {
          data = await tryFetch(`/nekos/v4/images/random?limit=1&rating=safe`)
          first = pickFirst(data)
          url =
            first?.url ??
            first?.image_url ??
            first?.image?.url ??
            first?.file ??
            first?.file_url ??
            findFirstHttpUrl(first)
        }

        if (!url) {
          const keys =
            first && typeof first === 'object' && !Array.isArray(first)
              ? Object.keys(first).slice(0, 12).join(',')
              : 'no-object'
          throw new Error(`no-url(keys:${keys || 'none'})`)
        }
        if (cancelled) return
        setImageUrl(url)
      } catch (e) {
        if (cancelled) return
        const msg = e instanceof Error ? e.message : 'unknown-error'
        setImageError(msg)
        setImageUrl('')
        emit('Mood image fetch failed', {
          level: 'WARN',
          detail: msg,
        })
      } finally {
        if (!cancelled) {
          setImageLoading(false)
        }
      }
    }

    loadMoodImage()

    return () => {
      cancelled = true
    }
  }, [mood, imageSeed])

  // Vista ultra minimalista para Crisis / Reset
  if (mood === 'reset') {
    return (
      <div className="min-h-screen bg-soft-ink text-soft-lilac font-sans flex items-center justify-center">
        <div className="max-w-sm rounded-3xl border border-soft-cyan/25 bg-black/40 p-6 shadow-[0_0_50px_rgba(148,163,184,0.45)] backdrop-blur-xl">
          <div className="mb-4 text-[0.7rem] tracking-[0.22em] text-soft-cyan/80">
            CRISIS // RESET
          </div>
          <div className="mb-4 flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full border border-soft-cyan/40 bg-soft-ink/80 animate-breathe-soft" />
            <div className="text-center text-xs text-soft-lilac/90">
              <p className="mb-1 font-medium">Respiración 4 · 7 · 8</p>
              <p>Inhala en 4 · Mantén 7 · Exhala en 8.</p>
              <p className="mt-2 text-soft-lilac/70">
                Sigue el círculo. No pienses en código todavía.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-xl border border-soft-cyan/40 bg-soft-ink px-3 py-2 text-xs font-medium text-soft-cyan hover:bg-soft-cyan/10 focus:outline-none focus:ring-2 focus:ring-soft-cyan/40"
            onClick={() => setMood('neutral')}
          >
            Volver al terminal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-void via-deep-purple to-soft-ink text-soft-lilac font-sans">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div
          className={[
            'overflow-hidden rounded-3xl border bg-deep-purple/60 backdrop-blur-xl',
            mood === 'chaos'
              ? 'border-red-400/80 shadow-[0_0_80px_rgba(248,113,113,0.55)]'
              : mood === 'melancholy'
              ? 'border-violet-400/80 shadow-[0_0_80px_rgba(167,139,250,0.55)]'
              : 'border-soft-cyan/25 shadow-[0_0_80px_rgba(56,189,248,0.35)]',
          ].join(' ')}
        >
          <AppHeader systemActive={systemActive} />

          <main className="grid gap-6 bg-deep-purple/40 p-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <ControlPanel
              systemActive={systemActive}
              setSystemActive={setSystemActive}
              onEmit={emit}
              onClear={clear}
              maxLines={maxLines}
              setMaxLines={setMaxLines}
              mood={mood}
              setMood={setMood}
              remainingSeconds={remainingSeconds}
              brainDump={brainDump}
              setBrainDump={setBrainDump}
              isExorcising={isExorcising}
              onExorcize={handleExorcize}
            />
            <div className="space-y-4">
              <MoodVisual
                mood={mood}
                imageUrl={imageUrl}
                imageLoading={imageLoading}
                imageError={imageError}
                onRefresh={refreshMoodImage}
              />
              <ActivityLog lines={lines} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
