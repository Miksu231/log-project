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
const isOpen = ref(false)
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
const notes = useCollection(noteDocuments, { ssrKey: "notes" })
const {
  execute: createNote,
  isLoading: isCreatingNote,
  error,
} = useAsyncState(
  () => {
    // avoid empty posts that will fail on Firestore anyway
    if (!content.value || !user.value) {
      return Promise.reject(new Error("Invalid note content"))
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
const { execute: deleteNote } = useAsyncState(
  (id) => {
    return deleteDoc(doc(db, "notes", id))
  },
  null,
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
    <h2 class="header">Create a new Note</h2>

    <form @submit.prevent="createNote()">
      <fieldset>
        <UFormGroup
          label="Note Content"
          required
          :error="error ? (error as Error).message : ''"
        >
          <UTextarea
            v-if="isCreatingNote"
            v-model="content"
            size="xl"
            :disabled="true"
            color="gray"
          />
          <UTextarea
            v-else
            v-model="content"
            placeholder="Write content here"
            size="xl"
            color="white"
          />
        </UFormGroup>
        <UInput type="submit" value="Save Note" />
      </fieldset>
    </form>
    <section>
      <h2 class="header">Notes for {{ getUserFriendlyDate }}</h2>
      <div v-if="notes.length > 0">
        <ul>
          <li v-for="note in notes" :key="note.id">
            <UCard class="noteContainer">
              <template #header>
                <p class="header">
                  Note created on
                  {{
                    note.createdAt
                      .toDate()
                      .toLocaleString("en-fi", { timeZone: timezone })
                  }}
                </p>
              </template>
              {{ note.content }}
              <template #footer>
                <UButton color="red" variant="soft" @click="isOpen = true">
                  Delete
                </UButton>
                <UModal v-model="isOpen">
                  <div class="modal">
                    <p class="confirmationText">
                      Are you sure you want to delete this note?
                    </p>
                    <div class="buttonRow">
                      <UButton
                        color="green"
                        variant="solid"
                        class="deleteButton"
                        @click="isOpen = false"
                      >
                        Cancel
                      </UButton>
                      <!-- prettier-ignore -->
                      <UButton
                        color="red"
                        variant="solid"
                        class="deleteButton"
                        @click="deleteNote(0, note.id); isOpen = false"
                      >
                        <p class="deleteText">Yes</p>
                      </UButton>
                    </div>
                  </div>
                </UModal>
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
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 8px;
  margin-right: 8px;
}
.noteContainer {
  margin-bottom: 32px;
}
.modal {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.buttonRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 1rem;
}
.confirmationText {
  font-weight: bold;
}
.deleteText {
  padding-top: 1px;
  padding-right: 8px;
  padding-left: 8px;
}
.header {
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
