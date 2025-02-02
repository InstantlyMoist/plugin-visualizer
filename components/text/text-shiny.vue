<template>
  <div :class="[
    'text-[#b5b5b5a4]',
    'bg-clip-text',
    'inline-block',
    '[text-shadow:_0_0_4px_rgb(86_39_22_/_100%)]',
    disabled ? '' : 'animate-shine',
    className,
  ]" :style="[
    'background-image: linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
    'background-size: 200% 100%',
    'Webkit-background-clip: text',
    `animation-duration: ${animationDuration}`,
  ]">
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Shiny Text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  animationDuration: {
    type: String,
    default: '2s'
  }
})
</script>

<style></style>