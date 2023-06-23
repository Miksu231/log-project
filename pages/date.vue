<script lang="ts" setup>
import { definePageMeta } from "~/.nuxt/imports"
import {
DocumentData,
addDoc,
    collection,
    limit,
    orderBy,
    query,
    serverTimestamp,
    where,
  } from "firebase/firestore"
import VueDatePicker from "@vuepic/vue-datepicker"
import { useAsyncState, useColorMode, useLocalStorage } from "@vueuse/core";
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
const getDate = computed({
  get: () => date.value ? date.value : new Date().toISOString().split("T")[0],
  set: (val) => {
    date.value = val.toISOString().split("T")[0]
  }
})
const getUserFriendlyDate = computed({
  get: () => date.value ? new Date(date.value).toDateString() : new Date().toDateString(),
  set: () => {}
})
const noteDocuments = computed(
  () => query(
  collection(db, "notes"),
  where("userId", "==", user.value?.uid),
  where("date", "==", getDate.value),
  orderBy("createdAt", "desc"),
  limit(10)
  )
)
const notes = useCollection(
  noteDocuments
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
      date: date.value ? date.value : new Date().toISOString().split("T")[0],
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
      <h3> Notes for {{ getUserFriendlyDate }}</h3>
      <ul v-if="notes">
        <li v-for="note in notes" :key="note.id">
          <span
            >{{ note.content }} - {{ note.createdAt.toDate().toISOString().split("T")[1] }}
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>
