import { ref, watch } from 'vue'

const KEY = 'music-web-theme'

function getInitial() {
  const stored = localStorage.getItem(KEY)
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const theme = ref(getInitial())

watch(theme, (val) => {
  document.documentElement.classList.toggle('dark', val === 'dark')
  localStorage.setItem(KEY, val)
}, { immediate: true })

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
