<template>
    <div class="glow-container" @mousemove="handleMousemove" @mouseenter="glowVisible = true" @mouseleave="glowVisible = false">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const x = ref(0)
const y = ref(0)
const glowVisible = ref(false)
let ticking = false

function handleMousemove(e: MouseEvent) {
  if (!ticking) {
    requestAnimationFrame(() => {
      x.value = e.offsetX
      y.value = e.offsetY
      ticking = false
    })
    ticking = true
  }
}
</script>

<style>
.glow-container {
  position: relative;
}
.glow-circle {
  position: absolute;
  width: 60px;
  height: 60px;
  pointer-events: none;
  border-radius: 50%;
  background: radial-gradient(rgba(255, 255, 0, 0.5), transparent 70%);
  transform: translate(-50%, -50%);
  transition: 0.1s;
}
</style>