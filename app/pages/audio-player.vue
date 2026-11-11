<template>
  <v-app>
    <v-app-bar color="primary" flat class="px-4">
      <v-btn icon="mdi-arrow-left" variant="text" to="/"></v-btn>
      <v-app-bar-title class="font-weight-bold">WaveSurfer.js Audio Player Integration</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8" max-width="900">
        <v-card class="pa-6 rounded-lg elevation-3">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <h2 class="text-h5 font-weight-bold">Interactive Waveform Studio</h2>
              <p class="text-subtitle-2 text-grey">Load preset tracks or upload your own audio file (.mp3 / .wav)</p>
            </div>
            <v-file-input
              v-model="uploadedFile"
              accept="audio/*"
              label="Upload Audio"
              prepend-icon="mdi-upload"
              density="compact"
              hide-details
              style="max-width: 260px;"
              @update:model-value="handleFileUpload"
            ></v-file-input>
          </div>

          <!-- Error Alert -->
          <v-alert v-if="errorMessage" type="warning" density="compact" class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <!-- Waveform Container -->
          <div ref="waveformRef" class="bg-grey-darken-4 rounded-lg pa-4 mb-4" style="min-height: 120px;"></div>

          <!-- Track Time & Status -->
          <div class="d-flex justify-space-between text-body-2 text-grey-darken-2 mb-4 font-weight-medium">
            <span>Current: {{ formatTime(currentTime) }}</span>
            <span class="text-primary font-weight-bold">{{ currentTrackName }}</span>
            <span>Duration: {{ formatTime(duration) }}</span>
          </div>

          <!-- Player Controls -->
          <div class="d-flex justify-center align-center ga-4 mb-6 flex-wrap">
            <v-btn icon="mdi-skip-backward" variant="tonal" @click="wavesurfer?.skip(-5)"></v-btn>
            <v-btn color="primary" size="x-large" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'" @click="togglePlay"></v-btn>
            <v-btn icon="mdi-skip-forward" variant="tonal" @click="wavesurfer?.skip(5)"></v-btn>
          </div>

          <v-divider class="mb-6"></v-divider>

          <!-- Secondary Settings (Volume, Speed, Presets) -->
          <v-row>
            <v-col cols="12" md="6">
              <v-slider
                v-model="volume"
                label="Volume"
                prepend-icon="mdi-volume-high"
                min="0"
                max="1"
                step="0.05"
                density="compact"
                hide-details
                @update:model-value="updateVolume"
              ></v-slider>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedSpeed"
                :items="[0.5, 0.75, 1, 1.25, 1.5, 2]"
                label="Playback Speed"
                density="compact"
                hide-details
                @update:model-value="updatePlaybackRate"
              ></v-select>
            </v-col>
          </v-row>

          <div class="mt-6">
            <span class="text-subtitle-2 font-weight-bold text-grey-darken-2 d-block mb-2">Preset Sample Tracks:</span>
            <div class="d-flex ga-2 flex-wrap">
              <v-btn 
                v-for="track in presetTracks" 
                :key="track.name" 
                variant="outlined" 
                size="small"
                @click="loadTrack(track.url, track.name)"
              >
                {{ track.name }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

import { ref, onMounted, onUnmounted } from 'vue'
import WaveSurfer from 'wavesurfer.js'

const route = useRoute()
const waveformRef = ref(null)
const wavesurfer = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const selectedSpeed = ref(Number(route.query.speed) || 1)

// Siguraduhin na valid HTTP URL ang gagamitin, kung wala o invalid, gamitin ang default working sample
const defaultAudioUrl = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'
const queryUrl = route.query.url
const audioUrlToLoad = (queryUrl && typeof queryUrl === 'string' && queryUrl.startsWith('http')) ? queryUrl : defaultAudioUrl

const currentTrackName = ref(route.query.title && route.query.title !== 'song' ? route.query.title : 'Acoustic Rain Sample')
const errorMessage = ref('')
const uploadedFile = ref(null)

const presetTracks = [
  { name: 'Acoustic Sample', url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg' },
  { name: 'Chimes Effect', url: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg' }
]

onMounted(() => {
  try {
    wavesurfer.value = WaveSurfer.create({
      container: waveformRef.value,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      cursorColor: '#ffffff',
      barWidth: 3,
      barRadius: 3,
      height: 100,
      normalize: true
    })

    // I-load ang wastong audioUrlToLoad na may kasamang fallback
    wavesurfer.value.load(audioUrlToLoad)

    wavesurfer.value.on('ready', () => {
      duration.value = wavesurfer.value.getDuration()
      errorMessage.value = ''
      // I-apply ang napiling speed rate galing sa library query
      if (selectedSpeed.value) {
        wavesurfer.value.setPlaybackRate(selectedSpeed.value)
      }
    })

    wavesurfer.value.on('audioprocess', (time) => {
      currentTime.value = time
    })

    wavesurfer.value.on('play', () => { isPlaying.value = true })
    wavesurfer.value.on('pause', () => { isPlaying.value = false })
    wavesurfer.value.on('finish', () => { isPlaying.value = false })
    
    wavesurfer.value.on('error', (err) => {
      errorMessage.value = `Audio playback error: ${err}`
    })
  } catch (err) {
    errorMessage.value = 'Failed to initialize WaveSurfer.js component.'
  }
})

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
  }
})

const togglePlay = () => {
  if (wavesurfer.value) {
    wavesurfer.value.playPause()
  }
}

const loadTrack = (url, name) => {
  currentTrackName.value = name
  if (wavesurfer.value) {
    wavesurfer.value.load(url)
  }
}

const handleFileUpload = (file) => {
  if (!file) return
  try {
    const fileUrl = URL.createObjectURL(file)
    currentTrackName.value = file.name
    wavesurfer.value.load(fileUrl)
  } catch (err) {
    errorMessage.value = 'Could not read uploaded audio file.'
  }
}

const updateVolume = (val) => {
  if (wavesurfer.value) {
    wavesurfer.value.setVolume(val)
  }
}

const updatePlaybackRate = (rate) => {
  if (wavesurfer.value) {
    wavesurfer.value.setPlaybackRate(rate)
  }
}

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
</script>