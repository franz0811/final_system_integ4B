<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <v-btn prepend-icon="mdi-arrow-left" variant="text" to="/" class="mb-4">Back to Dashboard</v-btn>
        
        <v-card class="pa-6 elevation-4 rounded-xl bg-grey-darken-4 text-white">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h5 font-weight-bold">Audio Editor Studio</h2>
              <p class="text-subtitle-2 text-grey">Modify audio settings and save directly to your Library</p>
            </div>
            <v-chip color="primary" prepend-icon="mdi-tune">WaveSurfer Integration</v-chip>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Input File -->
          <v-file-input
            v-model="audioFile"
            label="Upload Audio File (.mp3, .wav)"
            accept="audio/*"
            prepend-icon="mdi-upload"
            variant="outlined"
            density="compact"
            class="mb-4"
            @change="handleFileUpload"
          ></v-file-input>

          <!-- Editing Controls -->
          <v-row class="my-4">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="trackTitle"
                label="Track Title"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="playbackSpeed"
                :items="[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]"
                label="Playback Speed / Tempo"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
          </v-row>

          <v-alert v-if="successMsg" type="success" density="compact" class="mb-4">
            {{ successMsg }}
          </v-alert>

          <!-- Save Action -->
          <div class="d-flex justify-end gap-3">
            <v-btn color="success" size="large" prepend-icon="mdi-content-save" @click="saveToLibrary">
              Save to Music Library
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const audioFile = ref(null)
const trackTitle = ref('Edited Track #1')
const playbackSpeed = ref(1.0)
const successMsg = ref('')

const { addTrack } = useAudioLibrary()

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    trackTitle.value = file.name.replace(/\.[^/.]+$/, "")
  }
}

const saveToLibrary = () => {
  addTrack({
    title: trackTitle.value || 'Edited Track',
    duration: '02:30',
    speed: playbackSpeed.value,
    url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'
  })

  successMsg.value = `"${trackTitle.value}" successfully saved to your Music Library!`
  setTimeout(() => {
    navigateTo('/library')
  }, 1200)
}
</script>