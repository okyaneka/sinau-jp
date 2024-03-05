export function title(title: string) {
  return `${title ? title + ' - ' : ''} ${import.meta.env.VITE_APP_NAME}`.trim()
}
