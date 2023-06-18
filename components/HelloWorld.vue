<script setup lang="ts">
const props = defineProps({
  today: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
})
</script>

<template>
  <div>
    <p>Hello, welcome to this site. Today is {{ today }}</p>
  </div>
</template>

<style></style>
