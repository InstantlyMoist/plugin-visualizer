<script lang="ts" setup>
import * as d3 from 'd3'
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined> | null = null
let context: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null

const generateNodes = () => {
  const numNodes = 100
  return Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 3 + 2,
    baseRadius: Math.random() * 3 + 2,
    vx: Math.random() * 0.5 - 0.25,
    vy: Math.random() * 0.5 - 0.25
  }))
}

const initSimulation = () => {
  const nodes = generateNodes()

  simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-15))
    .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force('collision', d3.forceCollide<d3.SimulationNodeDatum>()
      .radius(d => (d as any).radius + 2)
      .iterations(2)
    )
    .alphaDecay(0.001)
    .velocityDecay(0.4)

  startAnimation()
}

const drawNode = (node: any) => {
  if (!context) return
  
  // Subtle pulsing effect
  node.radius = node.baseRadius + Math.sin(Date.now() * 0.002 + node.id) * 1

  // Consistent color
  context.beginPath()
  context.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2)
  context.fillStyle = `rgba(124, 58, 237, 0.1)`
  context.fill()

  context.beginPath()
  context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
  context.fillStyle = `rgba(124, 58, 237, 0.6)` // Fixed opacity
  context.fill()
}

const draw = () => {
  if (!canvasRef.value || !context) return
  
  context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  // Subtle motion trail
  context.fillStyle = 'rgba(9, 9, 11, 0.08)'
  context.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  simulation?.nodes().forEach(drawNode)
}

const startAnimation = () => {
  const animate = () => {
    draw()
    animationFrameId = requestAnimationFrame(animate)
  }
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  context = canvas.getContext('2d')
  
  initSimulation()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    simulation?.force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    simulation?.alpha(1).restart()
  })

})

onUnmounted(() => {
  simulation?.stop()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="fixed inset-0 -z-10 w-full h-full opacity-20 pointer-events-none"
  />
</template>