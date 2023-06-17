<script setup>
const counter = useState('counter', () => 0)
</script>

<template>
    <div>
        <p> Counter: {{  counter }} </p>
        <button @click="$event => counter++">
        </button>
    </div>
</template>