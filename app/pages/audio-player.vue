
<template>
  <v-app class="audio-app">

    <!-- TOP NAVIGATION -->
    <v-app-bar flat height="auto" class="audio-navbar">
      <div class="navbar-content">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-arrow-left"
            variant="tonal"
            color="white"
            to="/"
            class="mr-2"
          ></v-btn>

          <v-avatar color="deep-purple-accent-4" rounded="lg" size="42">
            <v-icon icon="mdi-waveform" color="white" size="26"></v-icon>
          </v-avatar>

          <div class="ml-3">
            <div class="text-subtitle-1 text-white font-weight-bold">
              WaveSync Studio
            </div>
            <div class="text-caption text-grey-lighten-1">
              Audio Player Workspace
            </div>
          </div>
        </div>

        <v-spacer class="d-none d-md-flex"></v-spacer>

        <v-chip
          color="success"
          variant="tonal"
          size="small"
          prepend-icon="mdi-circle"
          class="d-none d-sm-flex"
        >
          Studio Ready
        </v-chip>

        <v-file-input
          v-model="uploadedFile"
          accept="audio/*"
          label="Upload Audio"
          prepend-icon="mdi-cloud-upload"
          density="compact"
          hide-details
          variant="solo-filled"
          rounded="lg"
          class="upload-input"
          style="max-width: 240px;"
          @update:model-value="handleFileUpload"
        ></v-file-input>
      </div>
    </v-app-bar>

    <!-- MAIN CONTENT -->
    <v-main class="audio-background">
      <v-container fluid class="pa-3 pa-sm-4 pa-md-8">

        <!-- PAGE HEADER -->
        <div class="mb-6">
          <div class="text-caption text-deep-purple-lighten-2 font-weight-bold mb-2">
            YOUR CREATIVE WORKSPACE
          </div>

          <h1 class="text-h4 text-md-h3 font-weight-bold text-white">
            Audio Player
          </h1>

          <p class="text-body-2 text-grey-lighten-1 mt-2">
            Upload, play, trim, cut, and edit your audio tracks.
          </p>
        </div>

        <!-- ERROR ALERT -->
        <v-alert
          v-if="errorMessage"
          type="warning"
          variant="tonal"
          rounded="lg"
          density="comfortable"
          class="mb-5"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- MY SONG LIBRARY -->
        <v-card
          class="library-card pa-3 pa-sm-4 pa-md-6 mb-6"
          rounded="xl"
          elevation="0"
        >
          <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
            <div class="d-flex align-center">
              <v-avatar color="deep-purple-accent-4" rounded="lg" size="44">
                <v-icon icon="mdi-music-box-multiple" color="white" size="25"></v-icon>
              </v-avatar>

              <div class="ml-3">
                <h2 class="text-h6 font-weight-bold text-white">
                  My Song Library
                </h2>
                <p class="text-caption text-grey-lighten-1">
                  Choose a song from your uploaded audio files.
                </p>
              </div>
            </div>

            <v-btn
              color="deep-purple-lighten-2"
              variant="tonal"
              prepend-icon="mdi-refresh"
              rounded="lg"
              size="small"
              :loading="libraryLoading"
              @click="fetchSongLibrary"
            >
              Refresh
            </v-btn>
          </div>

          <!-- SEARCH SONG -->
          <v-text-field
            v-model="searchSong"
            placeholder="Search song title..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            color="deep-purple-lighten-2"
            bg-color="rgba(255,255,255,0.02)"
            hide-details
            clearable
            class="mb-4"
          ></v-text-field>

          <!-- LIBRARY LOADING -->
          <div
            v-if="libraryLoading && songs.length === 0"
            class="text-center py-8"
          >
            <v-progress-circular
              indeterminate
              color="deep-purple-lighten-2"
              size="36"
            ></v-progress-circular>

            <p class="text-caption text-grey-lighten-1 mt-3">
              Loading your song library...
            </p>
          </div>

          <!-- EMPTY LIBRARY -->
          <div
            v-else-if="songs.length === 0"
            class="library-empty text-center pa-6 rounded-xl"
          >
            <v-icon
              icon="mdi-music-note-off"
              color="grey-lighten-1"
              size="48"
            ></v-icon>

            <h3 class="text-subtitle-1 text-white font-weight-bold mt-3">
              No Songs Found
            </h3>

            <p class="text-caption text-grey-lighten-1 mt-1">
              Upload an audio file to add it to your library.
            </p>
          </div>

          <!-- NO SEARCH RESULTS -->
          <div
            v-else-if="filteredSongs.length === 0"
            class="library-empty text-center pa-6 rounded-xl"
          >
            <v-icon
              icon="mdi-magnify-close"
              color="grey-lighten-1"
              size="42"
            ></v-icon>

            <p class="text-body-2 text-white mt-3">
              No matching songs found.
            </p>
          </div>

          <!-- SONG LIST -->
          <v-row v-else dense>
            <v-col
              v-for="song in filteredSongs"
              :key="song.url"
              cols="12"
              sm="6"
              lg="4"
            >
              <v-card
                class="song-item pa-3"
                rounded="lg"
                flat
                :class="{
                  'song-active': currentAudioUrl === song.url
                }"
                @click="selectSong(song)"
              >
                <div class="d-flex align-center ga-3">
                  <v-avatar
                    rounded="lg"
                    size="46"
                    :color="currentAudioUrl === song.url
                      ? 'deep-purple-accent-3'
                      : 'blue-grey-darken-3'"
                  >
                    <v-icon
                      :icon="currentAudioUrl === song.url
                        ? 'mdi-music-circle'
                        : 'mdi-music-note'"
                      color="white"
                      size="26"
                    ></v-icon>
                  </v-avatar>

                  <div class="flex-grow-1 overflow-hidden">
                    <div class="text-body-2 font-weight-bold text-white text-truncate">
                      {{ song.name }}
                    </div>

                    <div class="text-caption text-grey-lighten-1">
                      {{ currentAudioUrl === song.url ? 'Currently selected' : 'Audio file' }}
                    </div>
                  </div>

                  <v-icon
                    :icon="currentAudioUrl === song.url
                      ? 'mdi-check-circle'
                      : 'mdi-play-circle-outline'"
                    :color="currentAudioUrl === song.url
                      ? 'deep-purple-lighten-2'
                      : 'grey-lighten-1'"
                    size="28"
                  ></v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center mt-4">
            <span class="text-caption text-grey-lighten-1">
              {{ songs.length }} {{ songs.length === 1 ? 'song' : 'songs' }} in library
            </span>

            <span class="text-caption text-grey-lighten-1">
              {{ filteredSongs.length }} displayed
            </span>
          </div>
        </v-card>

        <!-- MAIN PLAYER CARD -->
        <v-card class="player-card pa-3 pa-sm-4 pa-md-8" rounded="xl" elevation="0">

          <!-- PLAYER HEADER -->
          <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div class="d-flex align-center">
              <v-avatar size="52" rounded="lg" color="deep-purple-accent-4">
                <v-icon icon="mdi-music-note" size="30" color="white"></v-icon>
              </v-avatar>

              <div class="ml-3">
                <h2 class="text-h6 font-weight-bold text-white">
                  Now Playing
                </h2>
                <p class="text-caption text-grey-lighten-1">
                  Audio Track Information
                </p>
              </div>
            </div>

            <v-chip
              :color="isPlaying ? 'success' : 'grey'"
              variant="tonal"
              size="small"
              :prepend-icon="isPlaying ? 'mdi-play-circle' : 'mdi-pause-circle'"
            >
              {{ isPlaying ? 'Playing' : 'Paused' }}
            </v-chip>
          </div>

          <v-divider class="border-opacity-25 mb-6"></v-divider>

          <!-- TRACK INFORMATION -->
          <div class="text-center mb-6">
            <v-avatar size="90" rounded="xl" class="track-artwork mb-4">
              <v-icon icon="mdi-music" color="white" size="50"></v-icon>
            </v-avatar>

            <h2 class="text-h6 text-sm-h5 font-weight-bold text-white mb-2">
              {{ currentTrackName }}
            </h2>

            <p class="text-body-2 text-grey-lighten-1">
              WaveSync Audio Player
            </p>
          </div>

          <!-- WAVEFORM -->
          <div class="waveform-section pa-3 pa-sm-5 rounded-xl mb-5">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-4">
              <span class="text-subtitle-2 font-weight-bold text-white">
                <v-icon icon="mdi-waveform" color="deep-purple-lighten-2" class="mr-1"></v-icon>
                Audio Waveform
              </span>

              <v-chip size="x-small" color="deep-purple-lighten-2" variant="tonal">
                INTERACTIVE
              </v-chip>
            </div>

            <div ref="waveformRef" class="waveform-display"></div>

            <div class="d-flex justify-space-between mt-3">
              <span class="text-caption text-grey-lighten-1">
                {{ formatTime(currentTime) }}
              </span>
              <span class="text-caption text-grey-lighten-1">
                {{ formatTime(duration) }}
              </span>
            </div>

            <div v-if="!duration" class="text-center text-caption text-grey-lighten-1 mt-3">
              Upload or select an audio file to start playing and editing.
            </div>
          </div>

          <!-- PLAYBACK CONTROLS -->
          <div class="controls-section pa-3 pa-sm-5 rounded-xl mb-7">
            <div class="text-center text-caption text-grey-lighten-1 font-weight-bold mb-5">
              PLAYBACK CONTROLS
            </div>

            <div class="d-flex align-center justify-center flex-wrap ga-2 ga-sm-3">
              <v-btn
                icon="mdi-skip-backward"
                variant="text"
                color="white"
                size="large"
                :disabled="!duration"
                @click="jumpToStart"
                title="Jump to Start"
              ></v-btn>

              <v-btn
                icon="mdi-rewind-5"
                variant="tonal"
                color="white"
                :disabled="!duration"
                @click="skipAudio(-5)"
                title="Rewind 5s"
              ></v-btn>

              <v-btn
                :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                color="deep-purple-accent-3"
                size="x-large"
                class="main-play-button"
                elevation="5"
                @click="togglePlay"
                :disabled="!wavesurfer || !duration"
                title="Play / Pause"
              ></v-btn>

              <v-btn
                icon="mdi-fast-forward-5"
                variant="tonal"
                color="white"
                :disabled="!duration"
                @click="skipAudio(5)"
                title="Forward 5s"
              ></v-btn>

              <v-btn
                icon="mdi-skip-forward"
                variant="text"
                color="white"
                size="large"
                :disabled="!duration"
                @click="jumpToEnd"
                title="Jump to End"
              ></v-btn>
            </div>

            <v-divider class="my-5 border-opacity-25"></v-divider>

            <div class="d-flex justify-center flex-wrap ga-2">
              <v-btn
                :color="isLooping ? 'deep-purple-lighten-2' : 'grey-lighten-1'"
                :variant="isLooping ? 'tonal' : 'text'"
                :prepend-icon="isLooping ? 'mdi-repeat' : 'mdi-repeat-off'"
                @click="toggleLoop"
                rounded="lg"
                size="small"
              >
                {{ isLooping ? 'Loop On' : 'Loop Off' }}
              </v-btn>

              <v-btn
                color="white"
                variant="text"
                :prepend-icon="isMuted ? 'mdi-volume-off' : 'mdi-volume-high'"
                @click="toggleMute"
                rounded="lg"
                size="small"
              >
                {{ isMuted ? 'Muted' : 'Sound On' }}
              </v-btn>

              <v-btn
                color="white"
                variant="text"
                prepend-icon="mdi-stop"
                @click="stopAudio"
                rounded="lg"
                size="small"
                :disabled="!duration"
              >
                Stop
              </v-btn>
            </div>
          </div>

          <!-- AUDIO EDITING TOOLS -->
          <div class="editing-toolbar pa-3 pa-sm-4 rounded-xl mb-6">
            <div class="d-flex align-center mb-3">
              <v-icon icon="mdi-content-cut" color="deep-purple-lighten-2" class="mr-2"></v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-white">
                Audio Editing Tools
              </h3>
            </div>

            <p class="text-caption text-grey-lighten-1 mb-4">
              Drag across the waveform to select the part of the audio you want to edit.
            </p>

            <!-- ZOOM CONTROLS -->
            <div class="d-flex flex-wrap ga-2 mb-4">
              <v-btn
                color="white"
                variant="tonal"
                prepend-icon="mdi-magnify-plus"
                size="small"
                :disabled="!duration"
                @click="zoomIn"
              >
                Zoom In
              </v-btn>

              <v-btn
                color="white"
                variant="tonal"
                prepend-icon="mdi-magnify-minus"
                size="small"
                :disabled="!duration"
                @click="zoomOut"
              >
                Zoom Out
              </v-btn>

              <v-btn
                color="white"
                variant="text"
                prepend-icon="mdi-fit-to-screen"
                size="small"
                :disabled="!duration"
                @click="resetZoom"
              >
                Reset Zoom
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                color="white"
                variant="text"
                prepend-icon="mdi-selection-remove"
                size="small"
                :disabled="!selectedRegion"
                @click="clearSelection"
              >
                Clear Selection
              </v-btn>
            </div>

            <!-- SELECTED REGION INFORMATION -->
            <v-card
              v-if="selectedRegion"
              class="selected-region pa-3 pa-sm-4"
              rounded="lg"
              flat
            >
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-selection" color="deep-purple-lighten-2" class="mr-2"></v-icon>
                <span class="text-body-2 text-white font-weight-bold">
                  Selected Audio Region
                </span>
              </div>

              <v-row dense>
                <v-col cols="4">
                  <div class="text-caption text-grey-lighten-1">Start</div>
                  <div class="text-body-2 text-white font-weight-bold">
                    {{ formatTime(selectedRegion.start) }}
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="text-caption text-grey-lighten-1">End</div>
                  <div class="text-body-2 text-white font-weight-bold">
                    {{ formatTime(selectedRegion.end) }}
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="text-caption text-grey-lighten-1">Duration</div>
                  <div class="text-body-2 text-white font-weight-bold">
                    {{ formatTime(selectedRegion.end - selectedRegion.start) }}
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <div v-else class="selection-placeholder pa-3 rounded-lg">
              <v-icon icon="mdi-cursor-default-click-outline" color="grey-lighten-1" class="mr-2"></v-icon>
              <span class="text-caption text-grey-lighten-1">
                No region selected. Drag on the waveform to select an audio section.
              </span>
            </div>

            <!-- TRIM AND CUT -->
            <v-divider class="my-4 border-opacity-25"></v-divider>

            <div class="d-flex flex-wrap ga-2">
              <v-btn
                color="deep-purple-accent-3"
                prepend-icon="mdi-content-cut"
                rounded="lg"
                :disabled="!selectedRegion || editingBusy"
                :loading="editingBusy"
                @click="applyAudioEdit('trim')"
              >
                Trim Selected
              </v-btn>

              <v-btn
                color="error"
                variant="tonal"
                prepend-icon="mdi-delete-sweep"
                rounded="lg"
                :disabled="!selectedRegion || editingBusy"
                :loading="editingBusy"
                @click="applyAudioEdit('cut')"
              >
                Cut Selected
              </v-btn>
            </div>

            <div class="text-caption text-grey-lighten-1 mt-3">
              Editing creates a new WAV audio preview. Your original uploaded server file is not overwritten.
            </div>
          </div>

          <!-- TIME INDICATORS -->
          <v-row class="mb-5" dense>
            <v-col cols="12" sm="4">
              <div class="time-card pa-3 pa-sm-4 rounded-lg text-center">
                <v-icon icon="mdi-clock-outline" color="deep-purple-lighten-2" size="24"></v-icon>
                <div class="text-caption text-grey-lighten-1 mt-2">CURRENT TIME</div>
                <div class="text-h6 font-weight-bold text-white">
                  {{ formatTime(currentTime) }}
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="time-card pa-3 pa-sm-4 rounded-lg text-center">
                <v-icon icon="mdi-timer-outline" color="blue-lighten-2" size="24"></v-icon>
                <div class="text-caption text-grey-lighten-1 mt-2">TOTAL DURATION</div>
                <div class="text-h6 font-weight-bold text-white">
                  {{ formatTime(duration) }}
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="time-card pa-3 pa-sm-4 rounded-lg text-center">
                <v-icon icon="mdi-hourglass" color="teal-lighten-2" size="24"></v-icon>
                <div class="text-caption text-grey-lighten-1 mt-2">TIME REMAINING</div>
                <div class="text-h6 font-weight-bold text-white">
                  {{ formatTime(Math.max(0, duration - currentTime)) }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- AUDIO SETTINGS -->
          <div class="mb-2">
            <div class="d-flex align-center mb-4">
              <v-icon icon="mdi-tune-variant" color="deep-purple-lighten-2" class="mr-2"></v-icon>
              <h3 class="text-subtitle-1 font-weight-bold text-white">
                Audio Settings
              </h3>
            </div>

            <v-row>
              <!-- VOLUME -->
              <v-col cols="12" md="6">
                <div class="settings-card pa-4 rounded-xl">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-volume-high" color="deep-purple-lighten-2" class="mr-2"></v-icon>
                      <span class="text-body-2 text-white font-weight-medium">
                        Volume
                      </span>
                    </div>

                    <v-chip size="small" color="deep-purple-lighten-2" variant="tonal">
                      {{ Math.round(volume * 100) }}%
                    </v-chip>
                  </div>

                  <v-slider
                    v-model="volume"
                    min="0"
                    max="1"
                    step="0.05"
                    color="deep-purple-accent-3"
                    track-color="grey-darken-1"
                    hide-details
                    @update:model-value="updateVolume"
                  ></v-slider>
                </div>
              </v-col>

              <!-- PLAYBACK SPEED -->
              <v-col cols="12" md="6">
                <div class="settings-card pa-4 rounded-xl">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-speedometer" color="blue-lighten-2" class="mr-2"></v-icon>
                    <span class="text-body-2 text-white font-weight-medium">
                      Playback Speed
                    </span>
                  </div>

                  <v-select
                    v-model="selectedSpeed"
                    :items="[0.5, 0.75, 1, 1.25, 1.5, 2]"
                    :item-title="item => `${item}x`"
                    :item-value="item => item"
                    density="comfortable"
                    variant="outlined"
                    color="deep-purple-lighten-2"
                    hide-details
                    @update:model-value="updatePlaybackRate"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
          </div>

        </v-card>

        <!-- FOOTER -->
        <div class="text-center mt-7">
          <p class="text-caption text-grey-darken-1">
            © 2026 WaveSync Audio Studio. All rights reserved.
          </p>
        </div>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, onUnmounted } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'

definePageMeta({ middleware: 'auth' })

const waveformRef = ref(null)
const wavesurfer = shallowRef(null)
const regionsPlugin = shallowRef(null)
const selectedRegion = shallowRef(null)

const isPlaying = ref(false)
const isLooping = ref(false)
const isMuted = ref(false)
const previousVolume = ref(0.8)

const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const selectedSpeed = ref(1)

const currentTrackName = ref('No audio uploaded')
const currentAudioUrl = ref('')
const errorMessage = ref('')
const uploadedFile = ref(null)

const zoomLevel = ref(0)
const editingBusy = ref(false)

// SONG LIBRARY
const songs = ref([])
const searchSong = ref('')
const libraryLoading = ref(false)

const filteredSongs = computed(() => {
  const keyword = searchSong.value.trim().toLowerCase()

  if (!keyword) return songs.value

  return songs.value.filter(song =>
    song.name.toLowerCase().includes(keyword)
  )
})

// Blob URLs are kept until the page is closed.
const generatedObjectUrls = []

// INITIALIZE AUDIO PLAYER
onMounted(async () => {
  try {
    const regions = Regions.create()
    regionsPlugin.value = regions

    wavesurfer.value = WaveSurfer.create({
      container: waveformRef.value,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      cursorColor: '#ffffff',
      cursorWidth: 2,
      barWidth: 3,
      barRadius: 3,
      height: 120,
      normalize: true,
      interact: true,
      autoScroll: true,
      minPxPerSec: 0,
      plugins: [regions]
    })

    // Allow waveform selection.
    regions.enableDragSelection({
      color: 'rgba(124, 77, 255, 0.35)'
    })

    regions.on('region-created', (region) => {
      selectedRegion.value = region
    })

    regions.on('region-clicked', (region) => {
      selectedRegion.value = region
    })

    regions.on('region-updated', (region) => {
      selectedRegion.value = region
    })

    regions.on('region-removed', (region) => {
      if (selectedRegion.value?.id === region.id) {
        selectedRegion.value = null
      }
    })

    // Register WaveSurfer events BEFORE loading audio.
    wavesurfer.value.on('ready', () => {
      duration.value = wavesurfer.value.getDuration()
      currentTime.value = 0
      errorMessage.value = ''

      wavesurfer.value.setVolume(volume.value)
      wavesurfer.value.setPlaybackRate(selectedSpeed.value)
    })

    wavesurfer.value.on('timeupdate', (time) => {
      currentTime.value = time
    })

    wavesurfer.value.on('audioprocess', (time) => {
      currentTime.value = time
    })

    wavesurfer.value.on('play', () => {
      isPlaying.value = true
    })

    wavesurfer.value.on('pause', () => {
      isPlaying.value = false
    })

    wavesurfer.value.on('finish', () => {
      if (isLooping.value) {
        wavesurfer.value.play()
      } else {
        isPlaying.value = false
      }
    })

    wavesurfer.value.on('error', (err) => {
      console.error('WaveSurfer error details:', err)

      isPlaying.value = false
      duration.value = 0

      errorMessage.value = 'Unable to load this audio file. Please check if the file exists in the server.'
    })

    // Load the song library.
    await fetchSongLibrary()

    // Load the last uploaded audio, if one exists.
    const savedAudio = localStorage.getItem('saved_server_audio_url')
    const savedName = localStorage.getItem('saved_server_audio_name')

    if (savedAudio) {
      await loadTrack(savedAudio, savedName || 'Custom Uploaded Track')
    }

  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to initialize the audio player. Please check your WaveSurfer installation.'
  }
})

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
  }

  generatedObjectUrls.forEach((url) => {
    URL.revokeObjectURL(url)
  })
})

// SONG LIBRARY FUNCTIONS

const fetchSongLibrary = async () => {
  libraryLoading.value = true

  try {
    const response = await $fetch('/api/audio-library')

    // Expected API response: an array of { name, url }.
    const audioFiles = Array.isArray(response)
      ? response
      : response?.songs || response?.files || []

    songs.value = audioFiles
      .filter(song => song && song.url)
      .map(song => ({
        name: song.name || song.filename || 'Untitled Audio',
        url: song.url
      }))

  } catch (err) {
    console.error('Song library error:', err)
    errorMessage.value = 'Unable to load your song library. Please check the audio-library API.'
  } finally {
    libraryLoading.value = false
  }
}

const selectSong = async (song) => {
  if (!song?.url) {
    errorMessage.value = 'This song does not have a valid audio URL.'
    return
  }

  // Avoid reloading the same song.
  if (currentAudioUrl.value === song.url && duration.value > 0) {
    return
  }

  const loaded = await loadTrack(song.url, song.name)

  if (loaded) {
    localStorage.setItem('saved_server_audio_url', song.url)
    localStorage.setItem('saved_server_audio_name', song.name)
  }
}

// PLAYBACK FUNCTIONS

const togglePlay = () => {
  if (wavesurfer.value && duration.value) {
    wavesurfer.value.playPause()
  }
}

const stopAudio = () => {
  if (wavesurfer.value && duration.value) {
    wavesurfer.value.stop()
    isPlaying.value = false
    currentTime.value = 0
  }
}

const toggleLoop = () => {
  isLooping.value = !isLooping.value
}

const toggleMute = () => {
  if (!wavesurfer.value) return

  if (isMuted.value) {
    volume.value = previousVolume.value
    wavesurfer.value.setVolume(volume.value)
    isMuted.value = false
  } else {
    previousVolume.value = volume.value
    volume.value = 0
    wavesurfer.value.setVolume(0)
    isMuted.value = true
  }
}

const jumpToStart = () => {
  if (wavesurfer.value && duration.value) {
    wavesurfer.value.setTime(0)
  }
}

const jumpToEnd = () => {
  if (wavesurfer.value && duration.value) {
    wavesurfer.value.setTime(duration.value)
  }
}

const skipAudio = (seconds) => {
  if (!wavesurfer.value || !duration.value) return

  const nextTime = Math.max(
    0,
    Math.min(duration.value, currentTime.value + seconds)
  )

  wavesurfer.value.setTime(nextTime)
}

// AUDIO LOADING

const clearSelection = () => {
  if (regionsPlugin.value) {
    regionsPlugin.value.clearRegions()
  }

  selectedRegion.value = null
}


const loadTrack = async (url, name) => {
  if (!wavesurfer.value || !url) return false

  try {
    currentTrackName.value = name || 'Untitled Audio'
    currentAudioUrl.value = url
    currentTime.value = 0
    duration.value = 0
    zoomLevel.value = 0
    isPlaying.value = false
    errorMessage.value = ''

    // Clear previous selection
    clearSelection()

    // Load audio first
    await wavesurfer.value.load(url)

    // Reset zoom only after audio is loaded
    wavesurfer.value.zoom(0)

    return true

  } catch (err) {
    console.error('LOAD TRACK ERROR:', err)

    errorMessage.value = `Unable to load "${name || 'audio file'}". Check if the audio file exists and can be accessed.`

    duration.value = 0
    isPlaying.value = false

    return false
  }
}


const handleFileUpload = async (fileInput) => {
  const file = Array.isArray(fileInput) ? fileInput[0] : fileInput

  if (!file) return

  if (!file.type.startsWith('audio/')) {
    errorMessage.value = 'Please select a valid audio file.'
    uploadedFile.value = null
    return
  }

  try {
    errorMessage.value = ''

    const formData = new FormData()
    formData.append('audio', file)

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response && response.success && response.url) {
      const loaded = await loadTrack(response.url, file.name)

      if (loaded) {
        localStorage.setItem('saved_server_audio_url', response.url)
        localStorage.setItem('saved_server_audio_name', file.name)

        // Refresh library after successful upload.
        await fetchSongLibrary()

        uploadedFile.value = null
      }
    } else {
      errorMessage.value = 'The server did not return a valid audio URL.'
    }

  } catch (err) {
    console.error(err)
    errorMessage.value = 'Hindi na-save ang audio sa server. Please try again.'
  }
}

// AUDIO SETTINGS

const updateVolume = (val) => {
  if (wavesurfer.value) {
    wavesurfer.value.setVolume(val)

    if (val > 0) {
      isMuted.value = false
    } else {
      isMuted.value = true
    }
  }
}

const updatePlaybackRate = (rate) => {
  if (wavesurfer.value) {
    wavesurfer.value.setPlaybackRate(rate)
  }
}

// ZOOM FUNCTIONS

const zoomIn = () => {
  if (!wavesurfer.value || !duration.value) return

  zoomLevel.value = Math.min(zoomLevel.value + 20, 200)
  wavesurfer.value.zoom(zoomLevel.value)
}

const zoomOut = () => {
  if (!wavesurfer.value || !duration.value) return

  zoomLevel.value = Math.max(zoomLevel.value - 20, 0)
  wavesurfer.value.zoom(zoomLevel.value)
}

const resetZoom = () => {
  if (!wavesurfer.value) return

  zoomLevel.value = 0
  wavesurfer.value.zoom(0)
}

// AUDIO DECODING

const decodeAudioFile = async () => {
  if (!currentAudioUrl.value) {
    throw new Error('No audio file is currently loaded.')
  }

  const response = await fetch(currentAudioUrl.value)

  if (!response.ok) {
    throw new Error('Unable to retrieve the audio file for editing.')
  }

  const arrayBuffer = await response.arrayBuffer()
  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) {
    throw new Error('Your browser does not support audio editing.')
  }

  const audioContext = new AudioContextClass()

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return { audioBuffer, audioContext }
  } catch (err) {
    await audioContext.close()
    throw new Error('The audio file could not be decoded. Please try another audio file.')
  }
}

// WAV ENCODER

const encodeWav = (audioBuffer) => {
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const numberOfFrames = audioBuffer.length
  const bytesPerSample = 2
  const blockAlign = numberOfChannels * bytesPerSample
  const dataSize = numberOfFrames * blockAlign

  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44

  for (let frame = 0; frame < numberOfFrames; frame++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      let sample = audioBuffer.getChannelData(channel)[frame]

      sample = Math.max(-1, Math.min(1, sample))

      const pcmValue = sample < 0
        ? sample * 0x8000
        : sample * 0x7fff

      view.setInt16(offset, pcmValue, true)
      offset += 2
    }
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

// TRIM AND CUT FUNCTIONS

const applyAudioEdit = async (mode) => {
  if (!selectedRegion.value || !currentAudioUrl.value || editingBusy.value) {
    return
  }

  const start = selectedRegion.value.start
  const end = selectedRegion.value.end

  if (end <= start) {
    errorMessage.value = 'Invalid audio selection. Please select a valid region.'
    return
  }

  editingBusy.value = true
  errorMessage.value = ''

  let audioContext = null

  try {
    const decoded = await decodeAudioFile()
    const originalBuffer = decoded.audioBuffer
    audioContext = decoded.audioContext

    const sampleRate = originalBuffer.sampleRate
    const totalFrames = originalBuffer.length

    const startFrame = Math.max(
      0,
      Math.min(totalFrames, Math.floor(start * sampleRate))
    )

    const endFrame = Math.max(
      startFrame,
      Math.min(totalFrames, Math.floor(end * sampleRate))
    )

    if (endFrame <= startFrame) {
      throw new Error('The selected region is too short to edit.')
    }

    let outputStart = 0
    let outputEnd = 0

    if (mode === 'trim') {
      outputStart = startFrame
      outputEnd = endFrame
    } else if (mode === 'cut') {
      outputStart = 0
      outputEnd = totalFrames - (endFrame - startFrame)
    } else {
      throw new Error('Unknown audio editing operation.')
    }

    if (outputEnd <= outputStart) {
      throw new Error('The edited audio would be empty.')
    }

    const outputBuffer = audioContext.createBuffer(
      originalBuffer.numberOfChannels,
      outputEnd,
      sampleRate
    )

    for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
      const sourceData = originalBuffer.getChannelData(channel)
      const outputData = outputBuffer.getChannelData(channel)

      if (mode === 'trim') {
        outputData.set(sourceData.slice(startFrame, endFrame))
      } else {
        const beforeSelection = sourceData.slice(0, startFrame)
        const afterSelection = sourceData.slice(endFrame)

        outputData.set(beforeSelection, 0)
        outputData.set(afterSelection, beforeSelection.length)
      }
    }

    const wavBlob = encodeWav(outputBuffer)
    const editedUrl = URL.createObjectURL(wavBlob)

    generatedObjectUrls.push(editedUrl)

    const fileName = mode === 'trim'
      ? 'WaveSync-Trimmed-Audio.wav'
      : 'WaveSync-Cut-Audio.wav'

    // Download the edited WAV file.
    const downloadLink = document.createElement('a')
    downloadLink.href = editedUrl
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    // Load the edited audio as the new preview.
    currentAudioUrl.value = editedUrl
    currentTrackName.value = mode === 'trim'
      ? 'Trimmed Audio'
      : 'Cut Audio'

    currentTime.value = 0
    duration.value = 0
    zoomLevel.value = 0

    clearSelection()
    wavesurfer.value.zoom(0)
    await wavesurfer.value.load(editedUrl)

  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'An error occurred while editing the audio.'
  } finally {
    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close()
    }

    editingBusy.value = false
  }
}

// TIME FORMAT

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
</script>

<style scoped>
.audio-app {
  background: #0b1020;
  min-width: 0;
}

.audio-background {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 15% 10%,
      rgba(103, 58, 183, 0.13),
      transparent 35%
    ),
    #0b1020;
}

.audio-navbar {
  background: #11182b !important;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.navbar-content {
  width: 100%;
  min-height: 76px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 20px;
}

.upload-input {
  min-width: 180px;
}

.library-card {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  background: #141d32 !important;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 15px 40px rgba(0,0,0,0.20) !important;
}

.library-empty {
  background: #0d1528;
  border: 1px dashed rgba(255,255,255,0.15);
}

.song-item {
  background: #0d1528 !important;
  border: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
  transition: all 0.2s ease;
}

.song-item:hover {
  border-color: rgba(124,77,255,0.6);
  transform: translateY(-2px);
}

.song-active {
  border: 1px solid #9575cd !important;
  background: rgba(124,77,255,0.13) !important;
}

.player-card {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  background: #141d32 !important;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25) !important;
}

.track-artwork {
  background: linear-gradient(135deg, #7c4dff, #1565c0);
  box-shadow: 0 12px 35px rgba(103,58,183,0.3);
}

.waveform-section {
  background: #0b1223;
  border: 1px solid rgba(255,255,255,0.08);
  min-width: 0;
  overflow: hidden;
}

.waveform-display {
  min-height: 140px;
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.editing-toolbar {
  background: #0d1528;
  border: 1px solid rgba(255,255,255,0.08);
  min-width: 0;
}

.selected-region {
  background: rgba(124,77,255,0.10);
  border: 1px solid rgba(124,77,255,0.35);
}

.selection-placeholder {
  background: rgba(255,255,255,0.035);
  border: 1px dashed rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
}

.time-card {
  background: #0d1528;
  border: 1px solid rgba(255,255,255,0.07);
  transition: all 0.25s ease;
}

.time-card:hover {
  border-color: rgba(124,77,255,0.5);
  transform: translateY(-3px);
}

.controls-section {
  background: #0d1528;
  border: 1px solid rgba(255,255,255,0.07);
}

.main-play-button {
  width: 68px !important;
  height: 68px !important;
  box-shadow: 0 8px 25px rgba(103,58,183,0.35);
}

.settings-card {
  background: #0d1528;
  border: 1px solid rgba(255,255,255,0.07);
  height: 100%;
  min-width: 0;
}

@media (max-width: 600px) {
  .navbar-content {
    padding: 10px 12px;
    gap: 10px;
  }

  .upload-input {
    width: 100%;
    max-width: 100% !important;
    flex: 1 1 100%;
  }

  .player-card {
    padding: 16px !important;
  }

  .main-play-button {
    width: 58px !important;
    height: 58px !important;
  }

  .waveform-display {
    min-height: 120px;
  }

  .editing-toolbar .v-btn {
    max-width: 100%;
  }

  .selection-placeholder {
    align-items: flex-start;
  }
}

@media (max-width: 380px) {
  .player-card {
    padding: 12px !important;
  }

  .navbar-content {
    padding-left: 8px;
    padding-right: 8px;
  }

  .controls-section {
    padding: 12px !important;
  }
}
</style>
