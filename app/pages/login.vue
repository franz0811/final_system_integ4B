
<template>
  <v-container
    fluid
    class="login-background fill-height d-flex justify-center align-center"
  >
    <div class="background-glow glow-one"></div>
    <div class="background-glow glow-two"></div>

    <v-card
      class="login-card pa-8"
      max-width="440"
      width="100%"
      elevation="0"
    >
      <div class="text-center mb-8">
        <div class="logo-container mb-5">
          <v-icon
            icon="mdi-waveform"
            size="48"
            color="white"
          ></v-icon>
        </div>

        <h2 class="text-h4 font-weight-bold text-white mb-2">
          WaveSync
        </h2>

        <p class="text-body-2 text-grey-lighten-1">
          Your Sound. Your Creative Space.
        </p>
      </div>

      <div class="welcome-section mb-7">
        <h3 class="text-h5 font-weight-bold text-white mb-2">
          Welcome Back!
        </h3>

        <p class="text-body-2 text-grey-lighten-1">
          Sign in with your Google account to access your audio studio.
        </p>
      </div>

      <v-alert
        v-if="errorMsg"
        type="error"
        density="compact"
        variant="tonal"
        rounded="lg"
        class="mb-5"
      >
        {{ errorMsg }}
      </v-alert>

      <div class="google-section">
        <p class="text-caption text-grey-lighten-1 text-center mb-3">
          
        </p>

        <div
          id="google-signin-btn"
          class="d-flex justify-center mb-5 google-button"
        ></div>
      </div>

      <v-divider class="my-5 border-opacity-25"></v-divider>

      <div class="text-center">
        <div class="d-flex justify-center align-center mb-2">
          <v-icon
            icon="mdi-shield-check-outline"
            color="success"
            size="16"
            class="mr-2"
          ></v-icon>

          <span class="text-caption text-grey-lighten-1">
            Secure Google Authentication
          </span>
        </div>

        <p class="text-caption text-grey-darken-1 mt-4">
          © 2026 WaveSync Portal. All rights reserved.
        </p>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.login-background {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 24px;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(103, 58, 183, 0.22),
      transparent 35%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(33, 150, 243, 0.18),
      transparent 35%
    ),
    #0b1020;
}

.background-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.glow-one {
  background: rgba(124, 77, 255, 0.15);
  top: -100px;
  left: -100px;
}

.glow-two {
  background: rgba(0, 188, 212, 0.12);
  bottom: -100px;
  right: -100px;
}

.login-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 27, 48, 0.88) !important;
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 24px !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4) !important;
}

.logo-container {
  width: 85px;
  height: 85px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: linear-gradient(135deg, #7c4dff, #2979ff);
  box-shadow: 0 10px 30px rgba(124, 77, 255, 0.35);
}

.welcome-section {
  text-align: left;
}

.google-section {
  padding: 18px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.google-button {
  min-height: 44px;
}

@media (max-width: 600px) {
  .login-card {
    padding: 28px 20px !important;
  }

  .login-background {
    padding: 16px;
  }
}
</style>

<script setup>
const errorMsg = ref('')
const config = useRuntimeConfig()
const authToken = useCookie('google_auth_token')
const userProfile = useCookie('google_user_profile')

// Function para i-decode ang JWT token na ibinibigay ng Google
const decodeJwtResponse = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// I-handle ang pagtanggap ng credentials mula kay Google
const handleCredentialResponse = (response) => {
  const responsePayload = decodeJwtResponse(response.credential)

  if (responsePayload) {
    authToken.value = response.credential
    userProfile.value = JSON.stringify({
      name: responsePayload.name,
      email: responsePayload.email,
      picture: responsePayload.picture
    })
    navigateTo('/')
  } else {
    errorMsg.value = 'Failed to parse Google user information.'
  }
}

onMounted(() => {
  // I-load ang Google Identity Services script dynamically
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: handleCredentialResponse
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '350' }
      )
    }
  }
  document.head.appendChild(script)
})
</script>
