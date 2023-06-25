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
  <div class="mainPageLayout">
    <h1>Calendar Log</h1>
    <NavigationLinks class="sidebarNavigation" />
    <NuxtPage />
  </div>
</template>
<style>
.sidebarNavigation {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  height: 100%;
  width: 150px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
}
.mainPageLayout {
  margin-left: 140px;
  display: flex;
  flex-direction: column;
  background-color: var(--secondary-color);
  justify-content: center;
  height: 100%;
}
</style>
