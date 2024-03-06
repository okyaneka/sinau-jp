export function formattedTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toFixed()
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
