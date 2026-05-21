import { reactive } from 'vue'

export const player = reactive({
  current: null,
  queue: [],
  playing: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  howl: null,
})

export function play(music) {
  if (player.howl) {
    player.howl.unload()
    player.howl = null
  }

  import('howler').then(({ Howl }) => {
    player.howl = new Howl({
      src: [music.url],
      html5: true,
      volume: player.volume,
      onplay() {
        player.playing = true
        player.duration = player.howl.duration()
        requestAnimationFrame(tick)
      },
      onpause() {
        player.playing = false
      },
      onend() {
        next()
      },
    })
    player.current = music
    player.howl.play()
  })
}

export function toggle() {
  if (!player.howl) return
  if (player.playing) {
    player.howl.pause()
  } else {
    player.howl.play()
  }
}

export function next() {
  if (player.queue.length) {
    play(player.queue.shift())
  } else {
    player.playing = false
  }
}

export function prev() {
  // simplified: restart current
  if (player.howl) player.howl.seek(0)
}

export function seek(t) {
  if (player.howl) player.howl.seek(t)
}

export function setVolume(v) {
  player.volume = v
  if (player.howl) player.howl.volume(v)
}

function tick() {
  if (player.howl && player.playing) {
    player.currentTime = player.howl.seek() || 0
    requestAnimationFrame(tick)
  }
}
