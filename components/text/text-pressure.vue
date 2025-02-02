<template>
  <div
    ref="containerRef"
    class="relative w-full h-full overflow-hidden bg-transparent"
  >
    <h1
      ref="titleRef"
      :class="[
        'text-pressure-title',
        className,
        flex ? 'flex justify-between' : '',
        stroke ? 'stroke' : '',
        'uppercase',
        'text-center'
      ]"
      :style="titleStyle"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="el => setSpanRef(el, i)"
        :data-char="char"
        class="inline-block [text-shadow:_0_0_4px_rgb(86_39_22_/_100%)]"
      >
        {{ char }}
      </span>
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// Define Props with Default Values
const props = defineProps({
  text: {
    type: String,
    default: 'Compressa'
  },
  fontFamily: {
    type: String,
    default: 'Compressa VF'
  },
  fontUrl: {
    type: String,
    default: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2'
  },
  width: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Boolean,
    default: true
  },
  italic: {
    type: Boolean,
    default: true
  },
  alpha: {
    type: Boolean,
    default: false
  },
  flex: {
    type: Boolean,
    default: true
  },
  stroke: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Boolean,
    default: false
  },
  textColor: {
    type: String,
    default: '#FFFFFF'
  },
  strokeColor: {
    type: String,
    default: '#FF0000'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  className: {
    type: String,
    default: ''
  },
  minFontSize: {
    type: Number,
    default: 24
  },
  distDivisor: {
    type: Number,
    default: 2
  }
})

// Refs
const containerRef = ref(null)
const titleRef = ref(null)
const spansRef = ref([])

const mouseRef = ref({ x: 0, y: 0 })
const cursorRef = ref({ x: 0, y: 0 })

// Reactive States
const fontSize = ref(props.minFontSize)
const scaleY = ref(1)
const lineHeight = ref(1)

// Split text into characters
const chars = props.text.split('')

// Helper Functions
const dist = (a, b) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const setSize = () => {
  if (!containerRef.value || !titleRef.value) return

  const { width: containerW, height: containerH } = containerRef.value.getBoundingClientRect()

  let newFontSize = containerW / (chars.length / 2)
  newFontSize = Math.max(newFontSize, props.minFontSize)

  fontSize.value = newFontSize
  scaleY.value = 1
  lineHeight.value = 1

  requestAnimationFrame(() => {
    if (!titleRef.value) return
    const textRect = titleRef.value.getBoundingClientRect()

    if (props.scale && textRect.height > 0) {
      const yRatio = containerH / textRect.height
      scaleY.value = yRatio
      lineHeight.value = yRatio
    }
  })
}

const animate = () => {
  mouseRef.value.x += (cursorRef.value.x - mouseRef.value.x) / 15
  mouseRef.value.y += (cursorRef.value.y - mouseRef.value.y) / 15

  if (titleRef.value) {
    const titleRect = titleRef.value.getBoundingClientRect()
    const maxDist = titleRect.width / props.distDivisor

    spansRef.value.forEach(span => {
      if (!span) return

      const rect = span.getBoundingClientRect()
      const charCenter = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      }

      const d = dist(mouseRef.value, charCenter)

      const getAttr = (distance, minVal, maxVal) => {
        const val = maxVal - Math.abs((maxVal * distance) / maxDist)
        return Math.max(minVal, val + minVal)
      }

      const wdth = props.width ? Math.floor(getAttr(d, 5, 200)) : 100
      const wght = props.weight ? Math.floor(getAttr(d, 200, 900)) : 400
      const italVal = props.italic ? getAttr(d, 0, 1).toFixed(2) : 0
      const alphaVal = props.alpha ? getAttr(d, 0, 1).toFixed(2) : 1

      span.style.opacity = alphaVal
      span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`
    })
  }

  animationFrame = requestAnimationFrame(animate)
}

let animationFrame

// Lifecycle Hooks
onMounted(() => {
  const style = document.createElement('style')
  style.innerHTML = `
      @font-face {
        font-family: '${props.fontFamily}';
        src: url('${props.fontUrl}');
        font-style: normal;
      }
    `;
  document.head.appendChild(style);

  // Initialize mouse position
  if (containerRef.value) {
    const { left, top, width, height } = containerRef.value.getBoundingClientRect()
    mouseRef.value.x = left + width / 2
    mouseRef.value.y = top + height / 2
    cursorRef.value.x = mouseRef.value.x
    cursorRef.value.y = mouseRef.value.y
  }

  // Event Listeners
  const handleMouseMove = (e) => {
    cursorRef.value.x = e.clientX
    cursorRef.value.y = e.clientY
  }

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0]
      cursorRef.value.x = t.clientX
      cursorRef.value.y = t.clientY
    }
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })

  // Set initial size
  setSize()
  window.addEventListener('resize', setSize)

  // Start animation
  animate()

  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('resize', setSize)
    cancelAnimationFrame(animationFrame)
  })
})

// Watchers
watch(
  () => [props.scale, props.text],
  () => {
    setSize()
  }
)

// Methods
const setSpanRef = (el, index) => {
  spansRef.value[index] = el
}

// Computed Styles
const titleStyle = computed(() => ({
  fontFamily: props.fontFamily,
  fontSize: `${fontSize.value}px`,
  lineHeight: lineHeight.value,
  transform: `scale(1, ${scaleY.value})`,
  transformOrigin: 'center top',
  margin: 0,
  fontWeight: 100,
  color: props.stroke ? undefined : props.textColor
}))
</script>

<style scoped>
.stroke span {
  font-family: 'sex';
  position: relative;
  color: var(--textColor);
}
.stroke span::after {
  content: attr(data-char);
  position: absolute;
  left: 0;
  top: 0;
  color: transparent;
  z-index: -1;
  -webkit-text-stroke-width: var(--strokeWidth)px;
  -webkit-text-stroke-color: var(--strokeColor);
}
</style>