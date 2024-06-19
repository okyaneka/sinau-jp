export const config = { title: import.meta.env.VITE_APP_NAME }

export function title(title: string) {
  return `${title ? title + ' - ' : ''} ${config.title}`.trim()
}
