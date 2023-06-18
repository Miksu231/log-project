<script lang="ts" setup>
import { useLocalStorage, useAsyncState } from "@vueuse/core"
import {
  addDoc,
  serverTimestamp,
  collection,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore"
import {
  definePageMeta,
  useCollection,
  useCurrentUser,
  useFirestore,
} from "~/.nuxt/imports"

const user = useCurrentUser()
const db = useFirestore()

definePageMeta({
  linkTitle: "New Note",
  order: 3,
  middleware: ["authenticated"],
})

const content = useLocalStorage("note-content", "")

const lastNotes = useCollection(
  query(
    collection(db, "notes"),
    where("userId", "==", user.value?.uid),
    orderBy("createdAt", "desc"),
    limit(5)
  ),
  { ssrKey: "last-notes" }
)

const {
  execute: createNote,
  isLoading: isCreatingNote,
  error,
} = useAsyncState(
  () => {
    // avoid empty posts that will fail on Firestore anyway
    if (!content.value || !user.value) {
      return Promise.reject(new Error("Invalid post"))
    }

    return addDoc(collection(db, "notes"), {
      content: content.value,
      userId: user.value.uid,
      createdAt: serverTimestamp(),
    }).then(() => {
      // reset the post content if successful
      content.value = ""
    })
  },
  null,
  // avoid executing the function on mount
  { immediate: false }
)
</script>

<template>
  <main>
    <h2>Create a new Note</h2>

    <ErrorBox v-if="error" :error="error" />

    <form @submit.prevent="createNote()">
      <fieldset :disabled="isCreatingNote">
        <UTextarea v-model="content" size="xl" />
        <input type="submit" value="Save Note" />
      </fieldset>
    </form>

    <section>
      <h3>Last Notes</h3>
      <ul v-if="lastNotes">
        <li v-for="note in lastNotes" :key="note.id">
          <span
            >{{ note.content }} - {{ note.createdAt.toDate().toISOString() }}
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
fieldset {
  border: none;
}
</style>
