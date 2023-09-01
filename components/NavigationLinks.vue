<script lang="ts" setup>
const links = [
  {
    label: "Home page",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Login",
    icon: "i-heroicons-chart-bar",
    to: "/login",
  },
  {
    label: "Calendar",
    icon: "i-heroicons-calendar-days",
    to: "/date",
  },
]
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
