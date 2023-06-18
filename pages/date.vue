<script lang="ts" setup>
import { definePageMeta } from "~/.nuxt/imports"
definePageMeta({
  linkTitle: "Date",
  order: 6,
  middleware: ["authenticated"],
})
</script>
<template>
  <DatePicker />
</template>
