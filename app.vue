<script lang="ts" setup>
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const db = useFirestore()
const user = useCurrentUser()

const router = useRouter()
const route = useRoute()
watch(user, async (currentUser, previousUser) => {
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
    <h1 class="topbar">Calendar Log</h1>
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
  margin-left: 150px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.topbar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding-bottom: 16px;
  margin-bottom: 16px;
}
</style>
