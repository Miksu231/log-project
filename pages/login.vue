<script>
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInAnonymously,
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
        <b>You are currently logged in as:</b>
        <br />
        <UAvatar
          v-if="user.photoURL"
          class="avatar"
          :src="user.photoURL"
          size="2xl"
          alt="Avatar"
        />
        <br />
        <strong>{{ user.displayName }}.</strong>
        <br />
        <UButton
          color="blue"
          variant="soft"
          class="logButton"
          @click="signOut(auth)"
          >Logout</UButton
        >
      </template>

      <template v-else>
        <UButton
          color="blue"
          variant="soft"
          class="logButton"
          @click="signinRedirect()"
        >
          Sign in with Google (redirect)
        </UButton>
        <br />
        <UButton
          color="blue"
          variant="soft"
          class="logButton"
          @click="signInAnonymously(auth)"
        >
          Sign in Anonymously
        </UButton>
      </template>
    </template>
  </main>
</template>

<style scoped>
.avatar {
  margin-top: 16px;
  margin-bottom: 16px;
}

.logButton {
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 8px;
  margin-bottom: 8px;
  color: var(--secondary-color);
  background-color: var(--primary-color);
}
</style>
