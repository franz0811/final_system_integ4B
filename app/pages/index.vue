
<template>
  <v-app class="dashboard-app">

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      width="270"
      class="sidebar"
    >
      <!-- Branding -->
      <div class="pa-6 d-flex align-center">
        <v-avatar rounded="lg" color="deep-purple-accent-4" size="44">
          <v-icon icon="mdi-waveform" color="white" size="28"></v-icon>
        </v-avatar>

        <div class="ml-3">
          <div class="text-h6 font-weight-bold text-white">
            WaveSync
          </div>
          <div class="text-caption text-grey-lighten-1">
            Audio Studio
          </div>
        </div>
      </div>

      <v-divider class="border-opacity-25"></v-divider>

      <!-- User Profile -->
      <div class="pa-4">
        <v-card class="profile-card pa-3" rounded="lg" flat>
          <div class="d-flex align-center">
            <v-avatar size="42">
              <v-img
                :src="profile?.picture"
                alt="Avatar"
                cover
              ></v-img>
            </v-avatar>

            <div class="ml-3 overflow-hidden">
              <div class="text-body-2 font-weight-bold text-white text-truncate">
                {{ profile?.name || 'User' }}
              </div>

              <div class="text-caption text-grey-lighten-1 text-truncate">
                {{ profile?.email }}
              </div>
            </div>

            <v-spacer></v-spacer>

            <v-icon icon="mdi-check-circle" color="success" size="18"></v-icon>
          </div>
        </v-card>
      </div>

      <!-- Navigation -->
      <div class="px-4 mb-2">
        <div class="text-caption text-grey-lighten-1 font-weight-bold">
          WORKSPACE
        </div>
      </div>

      <v-list density="comfortable" nav class="px-3">
        <v-list-item
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          value="dashboard"
          to="/"
          active
          rounded="lg"
          class="nav-item mb-2"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-waveform"
          title="Audio Player"
          value="audio"
          to="/audio-player"
          rounded="lg"
          class="nav-item mb-2"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-4 border-opacity-25"></v-divider>

          <v-btn
            block
            color="red-lighten-1"
            variant="tonal"
            prepend-icon="mdi-logout"
            rounded="lg"
            size="large"
            @click="handleLogout"
          >
            Logout
          </v-btn>

          <div class="text-center mt-4 text-caption text-grey-darken-1">
            WaveSync Portal © 2026
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      flat
      height="75"
      class="topbar px-4"
    >
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-app-bar-title class="text-white font-weight-bold">
        Dashboard
        <div class="text-caption text-grey-lighten-1 font-weight-regular">
          Welcome to your audio workspace
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-chip
        color="success"
        variant="tonal"
        prepend-icon="mdi-circle"
        size="small"
        class="mr-3"
      >
        Online
      </v-chip>

      <v-avatar size="38">
        <v-img :src="profile?.picture" alt="Profile"></v-img>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-background">
      <v-container fluid class="pa-6 pa-md-8">

        <!-- Welcome Banner -->
        <v-card
          class="welcome-banner pa-6 pa-md-8 mb-8"
          rounded="xl"
          elevation="0"
        >
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-chip
                color="white"
                variant="tonal"
                size="small"
                prepend-icon="mdi-waveform"
                class="mb-4"
              >
                YOUR AUDIO WORKSPACE
              </v-chip>

              <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-3">
                Welcome back,
                {{ profile?.name || 'User' }}!
              </h1>

              <p class="text-body-1 text-white opacity-80 mb-5">
                Manage your audio experience and explore your creative
                workspace with WaveSync.
              </p>

              <v-chip
                color="success"
                variant="flat"
                size="small"
                prepend-icon="mdi-shield-check"
              >
                Google Authenticated Session Active
              </v-chip>
            </v-col>

            <v-col cols="12" md="4" class="text-center">
              <v-icon
                icon="mdi-waveform"
                size="150"
                color="white"
                class="welcome-icon"
              ></v-icon>
            </v-col>
          </v-row>
        </v-card>

        <!-- Section Header -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-5 ga-2">
          <div>
            <h2 class="text-h5 font-weight-bold text-white">
              Your Workspace
            </h2>
            <p class="text-body-2 text-grey-lighten-1">
              Access your audio tools and features.
            </p>
          </div>

          <v-chip
            color="deep-purple-lighten-2"
            variant="tonal"
            prepend-icon="mdi-apps"
          >
            Available Features
          </v-chip>
        </div>

        <!-- Feature Cards -->
        <v-row>
          <v-col cols="12" md="6" lg="4">
            <v-card
              class="feature-card pa-6 h-100"
              rounded="xl"
              elevation="0"
            >
              <div class="d-flex align-center justify-space-between mb-5">
                <v-avatar
                  color="deep-purple-accent-4"
                  rounded="lg"
                  size="58"
                >
                  <v-icon
                    icon="mdi-waveform"
                    color="white"
                    size="32"
                  ></v-icon>
                </v-avatar>

                <v-chip
                  color="success"
                  variant="tonal"
                  size="x-small"
                >
                  AVAILABLE
                </v-chip>
              </div>

              <h3 class="text-h6 font-weight-bold text-white mb-2">
                Audio Player
              </h3>

              <p class="text-body-2 text-grey-lighten-1 mb-6">
                Explore interactive audio waveforms, custom track playback,
                zoom settings, and audio file analysis.
              </p>

              <v-spacer></v-spacer>

              <v-btn
                color="deep-purple-accent-3"
                block
                size="large"
                rounded="lg"
                to="/audio-player"
                append-icon="mdi-arrow-right"
              >
                Open Audio Player
              </v-btn>
            </v-card>
          </v-col>

          <!-- Future Feature Placeholder -->
          <v-col cols="12" md="6" lg="4">
            <v-card
              class="feature-card future-card pa-6 h-100"
              rounded="xl"
              elevation="0"
            >
              <v-avatar
                color="blue-darken-2"
                rounded="lg"
                size="58"
                class="mb-5"
              >
                <v-icon
                  icon="mdi-music-box-multiple"
                  color="white"
                  size="32"
                ></v-icon>
              </v-avatar>

              <h3 class="text-h6 font-weight-bold text-white mb-2">
                Audio Library
              </h3>

              <p class="text-body-2 text-grey-lighten-1 mb-6">
                A dedicated space for organizing and managing your
                audio collections.
              </p>

              <v-spacer></v-spacer>

              <v-chip color="grey" variant="tonal">
                <v-icon start icon="mdi-clock-outline"></v-icon>
                Coming Soon
              </v-chip>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <v-card
              class="feature-card future-card pa-6 h-100"
              rounded="xl"
              elevation="0"
            >
              <v-avatar
                color="teal-darken-2"
                rounded="lg"
                size="58"
                class="mb-5"
              >
                <v-icon
                  icon="mdi-chart-line"
                  color="white"
                  size="32"
                ></v-icon>
              </v-avatar>

              <h3 class="text-h6 font-weight-bold text-white mb-2">
                Audio Analytics
              </h3>

              <p class="text-body-2 text-grey-lighten-1 mb-6">
                Discover detailed audio information and playback
                analysis tools.
              </p>

              <v-spacer></v-spacer>

              <v-chip color="grey" variant="tonal">
                <v-icon start icon="mdi-clock-outline"></v-icon>
                Coming Soon
              </v-chip>
            </v-card>
          </v-col>
        </v-row>

        <!-- Bottom Information -->
        <v-card
          class="info-card pa-5 mt-8"
          rounded="xl"
          elevation="0"
        >
          <div class="d-flex align-center flex-wrap ga-3">
            <v-icon
              icon="mdi-information-outline"
              color="deep-purple-lighten-2"
              size="28"
            ></v-icon>

            <div>
              <div class="text-body-2 font-weight-bold text-white">
                WaveSync Audio Studio
              </div>

              <div class="text-caption text-grey-lighten-1">
                Your personal space for audio playback and waveform interaction.
              </div>
            </div>
          </div>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const drawer = ref(true)
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

<style scoped>
.dashboard-app {
  background: #0b1020;
}

.sidebar {
  background: #11182b !important;
  border-right: 1px solid rgba(255,255,255,0.07);
}

.profile-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
}

.nav-item {
  color: #aeb9d0;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: rgba(124,77,255,0.12);
  color: white;
}

.nav-item.v-list-item--active {
  background: rgba(124,77,255,0.22);
  color: white !important;
}

.topbar {
  background: #11182b !important;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.main-background {
  background: #0b1020;
  min-height: 100vh;
}

.welcome-banner {
  background:
    radial-gradient(
      circle at 85% 30%,
      rgba(255,255,255,0.15),
      transparent 30%
    ),
    linear-gradient(120deg, #512da8, #283593, #1565c0);
  border: 1px solid rgba(255,255,255,0.12);
  overflow: hidden;
}

.welcome-icon {
  opacity: 0.85;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
}

.feature-card {
  background: #151e33;
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(124,77,255,0.6);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
}

.future-card {
  opacity: 0.85;
}

.info-card {
  background: #151e33;
  border: 1px solid rgba(255,255,255,0.07);
}

@media (max-width: 600px) {
  .welcome-banner {
    text-align: center;
  }

  .welcome-icon {
    font-size: 90px !important;
  }
}
</style>
