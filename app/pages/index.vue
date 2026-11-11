<template>
  <v-app>
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer v-model="drawer" permanent app>
      <v-list-item
        :prepend-avatar="userAvatar"
        :title="userName"
        :subtitle="userEmail"
        class="py-4"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/" active></v-list-item>
        <v-list-item prepend-icon="mdi-waveform" title="Audio Player" value="audio" to="/audio-player"></v-list-item>
        <v-list-item prepend-icon="mdi-tune-vertical" title="Audio Editor" value="editor" to="/editor"></v-list-item>
        <v-list-item prepend-icon="mdi-music-box-multiple" title="Music Library" value="library" to="/library"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="error" variant="text" prepend-icon="mdi-logout" @click="handleLogout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Student Dashboard</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container class="pa-6">
        <v-card class="pa-6 mb-6 elevation-3 rounded-xl bg-grey-darken-4 text-white">
          <h2 class="text-h5 font-weight-bold text-blue-accent-3 mb-2">Welcome back, {{ userName }}!</h2>
          <p class="text-subtitle-2 text-grey-lighten-1">{{ userEmail }}</p>
          <v-chip color="success" size="small" class="mt-3" prepend-icon="mdi-check-circle">
            Google Authenticated Session Active
          </v-chip>
        </v-card>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-3 rounded-xl bg-grey-darken-4 text-white h-100">
              <v-icon icon="mdi-tune-vertical" size="48" color="blue" class="mb-2"></v-icon>
              <h3 class="text-h6 font-weight-bold">Audio Editor Studio</h3>
              <p class="text-body-2 text-grey-lighten-1 mb-4">
                Trim audio, adjust speed, edit waveforms, and save modified tracks directly to your library.
              </p>
              <v-btn color="primary" block to="/editor" prepend-icon="mdi-square-edit-outline">
                Open Audio Editor
              </v-btn>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-6 elevation-3 rounded-xl bg-grey-darken-4 text-white h-100">
              <v-icon icon="mdi-music-box-multiple" size="48" color="cyan" class="mb-2"></v-icon>
              <h3 class="text-h6 font-weight-bold">Music & Audio Library</h3>
              <p class="text-body-2 text-grey-lighten-1 mb-4">
                Manage your saved audio collection, play edited tracks, and export audio files.
              </p>
              <v-btn color="cyan" variant="flat" block to="/library" prepend-icon="mdi-playlist-music">
                View Library
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const authToken = useCookie('google_auth_token')
const userProfileCookie = useCookie('google_user_profile')

const userInfo = computed(() => {
  try {
    return userProfileCookie.value ? JSON.parse(userProfileCookie.value) : {}
  } catch (e) {
    return {}
  }
})

const userName = computed(() => userInfo.value.name || 'Franz Navarro')
const userEmail = computed(() => userInfo.value.email || 'franznavarro260@gmail.com')
const userAvatar = computed(() => userInfo.value.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Franz')

const handleLogout = () => {
  authToken.value = null
  userProfileCookie.value = null
  navigateTo('/login')
}
</script>