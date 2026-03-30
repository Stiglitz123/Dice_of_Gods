/*
------------------------------------------------------------
audioPlayer.ts
Gestion simple du lecteur BGM (lecture, arrêt, fondu) pour l’ambiance sonore du client.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { createAudioPlayer, AudioPlayer } from 'expo-audio'

let bgm: AudioPlayer = createAudioPlayer()
let current: number | undefined = undefined
bgm.loop = true
bgm.volume = 0.5


export async function playBGM(track: number) {
  if (bgm && current != track) {
    current = track
    bgm.replace(track)
    await bgm.seekTo(0)
    bgm.play()
  }
}

export async function stopBGM() {
  if (bgm) {
    bgm.pause()
    await bgm.seekTo(0)
  } 
  
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
export async function fadeOutBGM(duration = 1500, steps = 12) {
  if (!bgm) return
  const currentBGM: AudioPlayer = bgm

  const startVolume: number = bgm.volume ?? 1
  const stepDuration: number = duration / steps
  const volumeStep: number = startVolume / steps

  for (let i = 0; i < steps; i++) {
    if (currentBGM != bgm) { return }
    const nextVolume = Math.max(startVolume - volumeStep * (i + 1), 0)
    bgm.volume = nextVolume
    await wait(stepDuration)
  }
  await stopBGM()
}
