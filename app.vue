<script lang="ts" setup>
import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore"

const db = useFirestore()
const user = useCurrentUser()

const router = useRouter()
const route = useRoute()
watch(user, async (currentUser, previousUser) => {
  if (currentUser) {
    addDoc(collection(db, "users"), currentUser)
  }
  // redirect to login if they logout
  if (!currentUser && previousUser) {
    return router.push({ name: "login" })
  }
  // redirect the user if they are logged in but were rejected because the user wasn't ready yet
  if (currentUser && typeof route.query.redirect === "string") {
    return router.push(route.query.redirect)
  }

  // update user info
  if (currentUser && !currentUser.isAnonymous) {
    const userDoc = doc(db, "users", currentUser.uid)
    const userData = {
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      lastLogin: serverTimestamp(),
    }
    const existingUser = await getDoc(userDoc)

    if (existingUser.exists()) {
      await updateDoc(userDoc, userData)
    } else {
      await setDoc(userDoc, {
        ...userData,
        joinedAt: serverTimestamp(),
      })
    }
  }
})
</script>

<template>
  <div>
    <h1>Calendar Log</h1>
    <NavigationLinks />
    <NuxtPage />
  </div>
</template>
