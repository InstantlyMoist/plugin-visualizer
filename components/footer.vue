<template>
  <footer class="border-t border-zinc-800 mt-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <i class="text-sm text-zinc-400">
            All data is removed after 7 days
          </i>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="https://github.com/InstantlyMoist/plugin-visualizer" target="_blank"
            class="text-zinc-400 hover:text-purple-500 transition-colors" aria-label="PluginVisualizer GitHub repository">
            <Icon name="uil:github" class="text-2xl" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>