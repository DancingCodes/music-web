import { reactive } from 'vue'
import { Howl } from 'howler'

export const player = reactive({
  current: null,
  queue: [],
  queueIndex: -1,
  playing: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  playMode: 'sequential',
})

let sound = null
let timeRaf = null

function stopTimeLoop() {
  if (timeRaf) {
    cancelAnimationFrame(timeRaf)
    timeRaf = null
  }
}

function startTimeLoop() {
  stopTimeLoop()
  function tick() {
    if (!sound || !player.playing) {
      timeRaf = null
      return
    }
    player.currentTime = sound.seek() || 0
    timeRaf = requestAnimationFrame(tick)
  }
  timeRaf = requestAnimationFrame(tick)
}

function destroySound() {
  stopTimeLoop()
  if (sound) {
    sound.unload()
    sound = null
  }
}

export function play(music, queue) {
  if (queue) {
    player.queue = queue
    player.queueIndex = queue.findIndex(m => m.id === music.id)
  }

  player.current = music
  destroySound()

  sound = new Howl({
    src: [music.url],
    html5: true,
    volume: player.volume,
    onplay: () => {
      player.playing = true
      player.duration = sound.duration()
      startTimeLoop()
    },
    onpause: () => {
      player.playing = false
      stopTimeLoop()
    },
    onend: () => {
      player.playing = false
      stopTimeLoop()
      if (player.playMode === 'single') {
        sound.seek(0)
        sound.play()
      } else {
        next()
      }
    },
    onloaderror: () => {
      player.playing = false
      stopTimeLoop()
    },
  })

  sound.play()
}

export function toggle() {
  if (!player.current) return
  if (!sound) {
    play(player.current, player.queue.length ? player.queue : [player.current])
    return
  }
  if (player.playing) {
    sound.pause()
  } else {
    sound.play()
  }
}

export function next() {
  if (player.queue.length === 0) return
  let i
  if (player.playMode === 'shuffle') {
    i = Math.floor(Math.random() * player.queue.length)
  } else {
    i = (player.queueIndex + 1) % player.queue.length
  }
  play(player.queue[i], player.queue)
}

export function prev() {
  if (player.queue.length === 0) return
  const i = (player.queueIndex - 1 + player.queue.length) % player.queue.length
  play(player.queue[i], player.queue)
}

export function seek(t) {
  if (!sound || !isFinite(t)) return
  sound.seek(t)
  player.currentTime = t
}

export function setVolume(v) {
  player.volume = v
  if (sound) sound.volume(v)
}

export function togglePlayMode() {
  const modes = ['sequential', 'single', 'shuffle']
  const idx = modes.indexOf(player.playMode)
  player.playMode = modes[(idx + 1) % modes.length]
}
