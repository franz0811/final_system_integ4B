<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <v-btn prepend-icon="mdi-arrow-left" variant="text" to="/" class="mb-4">Back to Dashboard</v-btn>

        <v-card class="pa-6 elevation-4 rounded-xl bg-grey-darken-4 text-white">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h5 font-weight-bold">Music & Audio Library</h2>
              <p class="text-subtitle-2 text-grey">All saved and edited tracks in your repository</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" to="/editor">Edit New Track</v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-table theme="dark" class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left">Track Title</th>
                <th class="text-left">Speed Rate</th>
                <th class="text-left">Date Added</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in tracks" :key="track.id">
                <td class="font-weight-bold">
                  <v-icon icon="mdi-music-note" color="primary" class="mr-2"></v-icon>
                  {{ track.title }}
                </td>
                <td><v-chip size="x-small" color="info">{{ track.speed }}x</v-chip></td>
                <td class="text-grey">{{ track.dateAdded }}</td>
                <td class="text-center">
                  <!-- Dito ibinigay ang query parameters para madala ang url at title sa audio player -->
                  <v-btn 
                    icon="mdi-play" 
                    size="small" 
                    color="success" 
                    class="mr-2" 
                    :to="{ path: '/audio-player', query: { url: track.url, title: track.title, speed: track.speed } }"
                  ></v-btn>
                  <v-btn icon="mdi-delete" size="small" color="error" @click="deleteTrack(track.id)"></v-btn>
                </td>
              </tr>
              <tr v-if="tracks.length === 0">
                <td colspan="4" class="text-center text-grey py-6">
                  No tracks available in your library. Use the Audio Editor to add new tracks!
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const { tracks, deleteTrack } = useAudioLibrary()
</script>