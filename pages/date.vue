<script lang="ts" setup>
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore"
import VueDatePicker from "@vuepic/vue-datepicker"
import { useAsyncState, useColorMode, useLocalStorage } from "@vueuse/core"
import { definePageMeta } from "~/.nuxt/imports"
import "@vuepic/vue-datepicker/dist/main.css"
definePageMeta({
  linkTitle: "Date",
  order: 6,
  middleware: ["authenticated"],
})
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")
const db = useFirestore()
const user = useCurrentUser()
const date = ref()
const content = useLocalStorage("note-content", "")
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const getDate = computed({
  get: () => (date.value ? date.value : new Date().toISOString().split("T")[0]),
  set: (val) => {
    date.value = val.toISOString().split("T")[0]
  },
})
const getUserFriendlyDate = computed({
  get: () =>
    date.value
      ? new Date(date.value).toDateString()
      : new Date().toDateString(),
  set: () => {},
})
const noteDocuments = computed(() =>
  query(
    collection(db, "notes"),
    where("userId", "==", user.value?.uid),
    where("date", "==", getDate.value),
    orderBy("createdAt", "desc")
  )
)
const notes = useCollection(noteDocuments)
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
      date: getDate.value,
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
const { execute: deleteNote } = useAsyncState((id) => {
  return deleteDoc(doc(db, "notes", id))
}, null)
</script>
<template>
  <main>
    <VueDatePicker
      v-model="getDate"
      week-start="1"
      format="dd/MM/yyyy HH:mm"
      week-numbers="iso"
      :dark="isDark"
      :inline="true"
    />
    <h2>Create a new Note</h2>

    <ErrorBox v-if="error" :error="error" />

    <form @submit.prevent="createNote()">
      <fieldset :disabled="isCreatingNote">
        <UTextarea v-model="content" size="xl" />
        <input type="submit" value="Save Note" />
      </fieldset>
    </form>
    <section>
      <h2>
        <b>Notes for {{ getUserFriendlyDate }}</b>
      </h2>
      <div v-if="notes.length > 0">
        <ul>
          <li v-for="note in notes" :key="note.id">
            <UCard class="noteContainer">
              <template #header>
                <p>
                  <b
                    >Note created on
                    {{
                      note.createdAt
                        .toDate()
                        .toLocaleString("en-fi", { timeZone: timezone })
                    }}</b
                  >
                </p>
              </template>
              {{ note.content }}
              <template #footer>
                <button class="deleteButton" @click="deleteNote(0, note.id)">
                  Delete
                </button>
              </template>
            </UCard>
          </li>
        </ul>
      </div>
      <div v-else>
        <h3>No notes found.</h3>
      </div>
    </section>
  </main>
</template>
<style>
.deleteButton {
  padding-left: 1rem;
  padding-right: 1rem;
  color: var(--failure-color);
  background-color: var(--secondary-color);
}
.noteContainer {
  margin-top: 32px;
  margin-bottom: 32px;
}
</style>
