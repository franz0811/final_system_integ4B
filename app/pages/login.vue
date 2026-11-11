<template>
  <v-container class="fill-height d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="pa-8 elevation-4 rounded-xl" max-width="420" width="100%">
      <div class="text-center mb-6">
        <v-icon icon="mdi-waveform" size="64" color="primary" class="mb-2"></v-icon>
        <h2 class="text-h5 font-weight-bold">WaveSync Portal</h2>
        <p class="text-subtitle-2 text-grey">Sign in with your Google account to proceed</p>
      </div>

      <v-alert v-if="errorMsg" type="error" density="compact" class="mb-4">
        {{ errorMsg }}
      </v-alert>

      <!-- Dito ilalagay o ikakabit ang Google Button container -->
      <div id="google-signin-btn" class="d-flex justify-center mb-4"></div>

      <v-divider class="my-4"></v-divider>
      
      <div class="text-center">
        <span class="text-caption text-grey">See the Sound. Feel the Wave</span>
      </div>
    </v-card>
  </v-container>
</template>

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
      
      // I-render ang opisyal na Google Sign-in button sa English
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '350', text: 'signin_with', locale: 'en' }
      )
    }
  }
  document.head.appendChild(script)
})
</script>