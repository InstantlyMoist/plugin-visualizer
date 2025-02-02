<script lang="ts" setup>
const links = [
  { name: 'GitHub', href: 'https://github.com/InstantlyMoist/plugin-visualizer' }
]
</script>

<template>
  <nav class="absolute w-full top-0 left-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <TextShiny class="text-2xl font-bold" text="PluginVisualizer" />
        </NuxtLink>
        
        <div class="flex items-center gap-6">
          <NuxtLink
            v-for="(link, index) in links"
            :key="index"
            :to="link.href"
            class="text-zinc-300 hover:text-purple-500 transition-colors"
            target="_blank"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>