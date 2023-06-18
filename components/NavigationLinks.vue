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
    label: "Date Picker",
    icon: "i-heroicons-calendar-days",
    to: "/date",
  },
  {
    label: "New",
    icon: "i-heroicons-clipboard-document",
    to: "/posts/new",
  },
  {
    label: "Others",
    icon: "i-heroicons-list-bullet-solid",
    to: "/posts/others",
  },
]
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
