<template>
  <v-app>
    <v-app-bar color="primary" flat class="px-4">
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-shield-account" class="mr-2"></v-icon> Student Dashboard
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" prepend-icon="mdi-logout" @click="handleLogout">Logout</v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <!-- Welcome Banner -->
        <v-card class="pa-6 mb-6 rounded-lg elevation-2">
          <div class="d-flex align-center flex-wrap ga-4">
            <v-avatar size="80" color="primary">
              <v-img :src="profile?.picture" alt="Avatar"></v-img>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold text-primary">Welcome back, {{ profile?.name || 'User' }}!</h1>
              <p class="text-body-1 text-grey-darken-1">{{ profile?.email }}</p>
              <v-chip color="success" size="small" class="mt-2" prepend-icon="mdi-check-circle">
                Google Authenticated Session Active
              </v-chip>
            </div>
          </div>
        </v-card>

        <!-- Navigation to Library Feature -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-6 rounded-lg elevation-2 h-100 d-flex flex-column justify-between">
              <div>
                <v-icon icon="mdi-waveform" size="48" color="primary" class="mb-3"></v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">WaveSurfer.js Audio Player</h3>
                <p class="text-body-2 text-grey-darken-1 mb-4">
                  Explore interactive audio waveforms, custom track playback, zoom settings, and audio file analysis.
                </p>
              </div>
              <v-btn color="primary" block to="/audio-player" prepend-icon="mdi-play-circle">
                Open Audio Player Feature
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const userProfileCookie = useCookie('google_user_profile')
const profile = computed(() => {
  try {
    return typeof userProfileCookie.value === 'string' 
      ? JSON.parse(userProfileCookie.value) 
      : userProfileCookie.value
  } catch {
    return { name: 'Franz', email: 'franz@example.com', picture: '' }
  }
})

const handleLogout = () => {
  useCookie('google_auth_token').value = null
  useCookie('google_user_profile').value = null
  navigateTo('/login')
}
</script>