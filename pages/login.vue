<script>
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth"
</script>

<script setup>
import { useCurrentUser, useFirebaseAuth } from "vuefire"
const googleAuthProvider = new GoogleAuthProvider()

definePageMeta({
  linkTitle: "Login",
  order: 1,
})

const auth = useFirebaseAuth()
const user = useCurrentUser()
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    error.value = reason
  })
}

function signinPopup() {
  error.value = null
  signInWithPopup(auth, googleAuthProvider).catch((reason) => {
    error.value = reason
  })
}

// display errors if any
// eslint-disable-next-line no-self-compare
const error = (ref < Error) | (null > null)
// only on client side
onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    error.value = reason
  })
})

const route = useRoute()
</script>

<template>
  <main>
    <template v-if="user === undefined">
      <p>Loading...</p>
    </template>
    <template v-else>
      <ErrorBox v-if="error" :error="error" />

      <div v-else-if="route.query.redirect" class="message-box">
        <p>
          Please login to access <code>{{ route.query.redirect }}</code
          >.
        </p>
      </div>

      <template v-if="user">
        <p>
          You are currently logged in as:
          <br />
          <img
            v-if="user.photoURL"
            class="avatar"
            :src="user.photoURL"
            referrerpolicy="no-referrer"
          />
          <br />
          <strong>{{ user.displayName }}.</strong>
        </p>

        <button @click="signOut(auth)">Logout</button>
      </template>

      <template v-else>
        <button @click="signinRedirect()">SignIn with Google (redirect)</button>
        <br />
        <button @click="signinPopup()">SignIn with Google (popup)</button>
        <br />
        <button @click="signInAnonymously(auth)">SignIn Anonymously</button>
      </template>
    </template>
  </main>
</template>

<style scoped>
.avatar {
  padding: 1em 0;
}

main > button {
  margin: 1em 0;
}
</style>
