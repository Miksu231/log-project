<script setup lang="ts">
import { useColorMode } from "@vueuse/core"
import VueDatePicker from "@vuepic/vue-datepicker"
import { computed } from "~/.nuxt/imports"
import { ref } from "vue"
import "@vuepic/vue-datepicker/dist/main.css"
const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
})

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === "dark")

const date = ref()

const attrs = [
  {
    key: "today",
    highlight: {
      color: "blue",
      fillMode: "outline",
      class: "!bg-gray-100 dark:!bg-gray-800",
    },
    dates: new Date(),
  },
]
</script>

<template>
  <VueDatePicker
    v-model="date"
    :attributes="attrs"
    week-start="1"
    format="dd/MM/yyyy HH:mm"
    week-numbers="iso"
    :dark="isDark"
    :inline="true"
  />
</template>
