<template>
  <!-- The span’s text updates reactively via the computed property -->
  <span :class="className" ref="elRef">{{ formattedValue }}</span>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Define component props with defaults
const props = defineProps({
  to: { type: Number, required: true },
  from: { type: Number, default: 0 },
  direction: { type: String, default: 'up' },      // "up" or "down"
  delay: { type: Number, default: 0 },              // Delay in seconds before animation starts
  duration: { type: Number, default: 2 },           // Duration of the animation in seconds (used to calculate spring parameters)
  className: { type: String, default: '' },
  startWhen: { type: Boolean, default: true },      // Whether to start the animation when in view
  separator: { type: String, default: '' },         // Optional thousands separator
  onStart: { type: Function, default: null },       // Callback when animation starts
  onEnd: { type: Function, default: null }          // Callback when animation ends
})

// Create a ref for the element to be observed
const elRef = ref(null)
// A flag to ensure the animation only starts once
const hasStarted = ref(false)

// Determine the initial value and the target value based on the direction.
// For a count-up, start at `from` and animate to `to`.
// For a count-down, start at `to` and animate to `from`.
const initialValue = props.direction === 'down' ? props.to : props.from
const targetValue = props.direction === 'down' ? props.from : props.to

// The reactive value that will be animated
const currentValue = ref(initialValue)

// A computed property that formats the current value for display
const formattedValue = computed(() => {
  const number = Math.round(currentValue.value)
  const options = {
    useGrouping: !!props.separator,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
  let formatted = new Intl.NumberFormat('en-US', options).format(number)
  if (props.separator) {
    // Replace the default comma with the custom separator if provided
    formatted = formatted.replace(/,/g, props.separator)
  }
  return formatted
})

// --- Spring Animation Setup ---

// Calculate spring parameters based on the provided duration.
// (These formulas are adapted from your original code.)
const stiffness = 100 / props.duration
const damping = 20 + 40 / props.duration

// Variables used by the animation loop
let velocity = 0
let lastTime = null
let animationFrameId = null

function animate(timestamp) {
  if (lastTime === null) {
    lastTime = timestamp
  }
  const dt = (timestamp - lastTime) / 1000 // delta time in seconds
  lastTime = timestamp

  // Apply simple spring physics:
  // acceleration = -stiffness * (currentValue - targetValue) - damping * velocity
  const displacement = currentValue.value - targetValue
  const acceleration = -stiffness * displacement - damping * velocity
  velocity += acceleration * dt
  currentValue.value += velocity * dt

  // Stop the animation when the value is very close to the target
  if (Math.abs(displacement) < 0.01 && Math.abs(velocity) < 0.01) {
    currentValue.value = targetValue
    velocity = 0
    animationFrameId = null
    return // Animation complete
  }
  animationFrameId = requestAnimationFrame(animate)
}

// --- Intersection Observer Setup ---

// We'll use native IntersectionObserver to start the animation when the element is in view.
let observer = null
let startTimeoutId = null
let onEndTimeoutId = null

onMounted(() => {
  if (props.startWhen && elRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.value) {
            hasStarted.value = true

            // Disconnect the observer since we only want to start the animation once.
            if (observer) {
              observer.disconnect()
            }

            // Invoke the onStart callback if provided.
            if (typeof props.onStart === 'function') {
              props.onStart()
            }

            // Start the animation after the specified delay.
            startTimeoutId = setTimeout(() => {
              lastTime = null // Reset time for the animation loop
              velocity = 0    // Reset velocity
              animationFrameId = requestAnimationFrame(animate)
            }, props.delay * 1000)

            // Call the onEnd callback after delay + duration seconds.
            onEndTimeoutId = setTimeout(() => {
              if (typeof props.onEnd === 'function') {
                props.onEnd()
              }
            }, (props.delay + props.duration) * 1000)
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    )
    observer.observe(elRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer && elRef.value) {
    observer.unobserve(elRef.value)
  }
  if (startTimeoutId) {
    clearTimeout(startTimeoutId)
  }
  if (onEndTimeoutId) {
    clearTimeout(onEndTimeoutId)
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
