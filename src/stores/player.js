import { reactive } from 'vue'

const audio = new Audio()

export const player = reactive({
  current: null,
  queue: [],
  queueIndex: -1,
  playing: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  loop: false,
})

audio.addEventListener('play', () => { player.playing = true })
audio.addEventListener('pause', () => { player.playing = false })
audio.addEventListener('timeupdate', () => { player.currentTime = audio.currentTime })
audio.addEventListener('loadedmetadata', () => { player.duration = audio.duration })
audio.addEventListener('progress', () => {
  if (audio.buffered.length > 0 && audio.duration) {
    player.buffered = audio.buffered.end(audio.buffered.length - 1) / audio.duration
  }
})
audio.addEventListener('ended', () => {
  player.playing = false
  if (player.loop) {
    audio.currentTime = 0
    audio.play()
  } else {
    next()
  }
})

export function play(music, queue) {
  if (queue) {
    player.queue = queue
    player.queueIndex = queue.findIndex(m => m.id === music.id)
  }

  player.current = music
  audio.src = music.url
  audio.volume = player.volume
  audio.play().catch(err => {
    if (err.name !== 'AbortError') throw err
  })
}

export function toggle() {
  if (!player.current) return
  if (player.playing) {
    audio.pause()
  } else {
    audio.play()
  }
}

export function next() {
  if (player.queue.length === 0) return
  const i = (player.queueIndex + 1) % player.queue.length
  play(player.queue[i], player.queue)
}

export function prev() {
  if (player.queue.length === 0) return
  const i = (player.queueIndex - 1 + player.queue.length) % player.queue.length
  play(player.queue[i], player.queue)
}

export function seek(t) {
  if (isFinite(t)) audio.currentTime = t
}

export function setVolume(v) {
  player.volume = v
  audio.volume = v
}

export function toggleLoop() {
  player.loop = !player.loop
}
