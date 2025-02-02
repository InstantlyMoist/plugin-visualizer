<script lang="ts" setup>
defineProps({
  title: String,
  description: String,
  icon: String
})
</script>

<template>
  <div class="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 hover:border-purple-500/30 transition-all duration-300">
    <Icon :name="icon ?? ''" class="text-4xl text-purple-500 mb-4" />
    <h3 class="text-xl font-bold mb-2 gradient-text">{{ title }}</h3>
    <p class="text-zinc-400">{{ description }}</p>
  </div>
</template>