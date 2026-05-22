export function parseLyrics(lrc) {
  if (!lrc || typeof lrc !== 'string') return []

  const lines = lrc.split('\n')
  const result = []
  const tagRe = /^\[(ti|ar|al|by|offset):/i
  const timeRe = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (tagRe.test(trimmed)) continue

    let match
    const timestamps = []
    while ((match = timeRe.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const ms = parseInt(match[3].padEnd(3, '0'), 10)
      timestamps.push(minutes * 60 + seconds + ms / 1000)
    }
    timeRe.lastIndex = 0

    const text = trimmed.replace(timeRe, '').trim()
    if (!text) continue

    if (timestamps.length === 0) {
      result.push({ time: 0, text })
    } else {
      for (const t of timestamps) {
        result.push({ time: t, text })
      }
    }
  }

  result.sort((a, b) => a.time - b.time)
  return result
}
