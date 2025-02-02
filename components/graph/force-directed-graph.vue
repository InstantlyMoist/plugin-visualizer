<template>
  <div ref="containerRef" class="w-full h-full">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
import * as d3 from 'd3'
import { ref, onMounted, onUnmounted } from 'vue'
import type { PluginPayload } from '~/server/models/plugins.schema';
const containerRef = ref<HTMLElement | null>(null)

interface NodeData {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  colorT: number; // 0..1 fade factor (0 = unhovered, 1 = hovered)
}

interface LinkData {
  source: NodeData | string;
  target: NodeData | string;
  unhoveredColor: string;
  hoveredColor: string;
  colorT: number; // 0..1 fade factor
}

let width = ref(0)
let height = ref(0)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let simulation: d3.Simulation<NodeData, LinkData> | null = null
let context: CanvasRenderingContext2D | null = null
let isDragging = false
let draggedNode: NodeData | null = null

// We'll store the current zoom transform (x, y, k)
let currentTransform = d3.zoomIdentity

const props = defineProps<{
  payload: PluginPayload,
  initialZoom?: number
}>()

// Emits
const emit = defineEmits([
  "nodeHover"
])

let hoveredNode: NodeData | null = null

let animationId: number | null = null
let lastTime = 0

onMounted(() => {
  if (props.payload) {
    drawGraph()
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
})


function drawGraph() {
  if (!props.payload) return
  const canvas = canvasRef.value
  const container = containerRef.value // Get container element
  if (!canvas || !container) return

  context = canvas.getContext('2d')
  if (!context) return

  // Use container's client dimensions instead of viewport
  width.value = container.clientWidth
  height.value = container.clientHeight
  canvas.width = width.value
  canvas.height = height.value

  // Update all force calculations to use new dimensions
  const cx = width.value / 2
  const cy = height.value / 2
  const r = Math.min(width.value, height.value) / 2 + 300

  const plugins = Object.keys(props.payload.plugins)
  const nodes: NodeData[] = plugins.map((p) => ({
    id: p,
    colorT: 0,
  }))

  const links: LinkData[] = []
  plugins.forEach((plugin) => {
    const { depend = [], softdepend = [] } = props.payload.plugins[plugin]
    depend.forEach((d: string) => {
      links.push({
        source: plugin,
        target: d,
        unhoveredColor: '#343434',
        hoveredColor: '#5E005C',
        colorT: 0
      })
    })
    softdepend.forEach((d: string) => {
      links.push({
        source: plugin,
        target: d,
        unhoveredColor: '#717171',
        hoveredColor: '#5E005C',
        colorT: 0
      })
    })
  })

  simulation = d3
    .forceSimulation<NodeData>(nodes)
    .force('charge', d3.forceManyBody().strength(-500))
    .force('circularBound', () => {
      nodes.forEach(node => {
        const dx = (node.x || cx) - cx
        const dy = (node.y || cy) - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > r) {
          const angle = Math.atan2(dy, dx)
          node.x = cx + r * Math.cos(angle)
          node.y = cy + r * Math.sin(angle)
        }
      })
    })
    .force('link', d3.forceLink<NodeData, LinkData>(links).id(d => d.id).distance(80))
    .force('x', d3.forceX(cx).strength(0.05))
    .force('y', d3.forceY(cy).strength(0.05))
    .force('k', d3.forceCollide(8))


    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
    .scaleExtent([0.1, 5])
    .filter(event => {
      return event.type === 'wheel' || (event.type === 'mousedown' && event.button === 2)
    })
    .on('zoom', (event) => {
      currentTransform = event.transform
    })

  d3.select(canvas)
    .call(zoom.scaleTo, props.initialZoom ?? 0.3)

  // Drag

  d3.select(canvas)
    .call(zoom)
    .on('contextmenu', event => event.preventDefault())
    .on('mousemove', (event) => {
      if (isDragging && draggedNode) {
        // Handle dragging
        const [canvasX, canvasY] = getCanvasCoords(event)
        const [x, y] = currentTransform.invert([canvasX, canvasY])
        draggedNode.fx = x
        draggedNode.fy = y
        simulation?.alpha(0.3).restart()
        hoveredNode = draggedNode
        emit('nodeHover', hoveredNode)
      } else {
        handleMouseMove(event)
      }
    })
    .on('mousedown', (event) => {
      if (event.button !== 0) return // Only left mouse button
      const [canvasX, canvasY] = getCanvasCoords(event)
      const [x, y] = currentTransform.invert([canvasX, canvasY])
      const node = findNode(x, y, (canvas as any).__nodes__ || [])
      if (node) {
        isDragging = true
        draggedNode = node
        node.fx = x
        node.fy = y
        simulation?.alpha(0.3).restart()
      }
    })
    .on('mouseup', () => {
      if (isDragging && draggedNode) {
        draggedNode.fx = null
        draggedNode.fy = null
        isDragging = false
        draggedNode = null
        simulation?.alpha(0.3).restart()
      }
    })
    .on('mouseleave', () => {
      if (isDragging && draggedNode) {
        draggedNode.fx = null
        draggedNode.fy = null
        isDragging = false
        draggedNode = null
        simulation?.alpha(0.3).restart()
      }
    })

    // Store data for the animation loop
    ; (canvas as any).__nodes__ = nodes
    ; (canvas as any).__links__ = links
}

function getCanvasCoords(event: MouseEvent) {
  if (!canvasRef.value) return [0, 0]
  const rect = canvasRef.value.getBoundingClientRect()
  return [
    event.clientX - rect.left,
    event.clientY - rect.top
  ]
}

// Modified mousemove handler
function handleMouseMove(event: MouseEvent) {
  if (!canvasRef.value) return
  const [canvasX, canvasY] = getCanvasCoords(event)
  const [x, y] = currentTransform.invert([canvasX, canvasY])
  hoveredNode = findNode(x, y, (canvasRef.value as any).__nodes__ || [])
  emit('nodeHover', hoveredNode)
}

function findNode(x: number, y: number, nodes: NodeData[]) {
  const radius = 8 * currentTransform.k
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.x == null || node.y == null) continue
    const dx = x - node.x
    const dy = y - node.y
    if (dx * dx + dy * dy < radius * radius) {
      return node
    }
  }
  return null
}

function animate() {
  if (!context || !canvasRef.value) {
    animationId = requestAnimationFrame(animate)
    return
  }
  const canvas = canvasRef.value
  const nodes = (canvas as any).__nodes__ as NodeData[] || []
  const links = (canvas as any).__links__ as LinkData[] || []

  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  nodes.forEach(node => {
    const isConnected = hoveredNode
      ? links.some(link =>
        ((link.source as NodeData).id === node.id && (link.target as NodeData).id === hoveredNode?.id)
      )
      : false

    const target = hoveredNode && (node.id === hoveredNode.id || isConnected) ? 1 : 0
    node.colorT += (target - node.colorT) * dt * 5
    node.colorT = Math.max(0, Math.min(1, node.colorT))
  })

  links.forEach(link => {
    const s = link.source as NodeData
    const t = link.target as NodeData
    const isConnected = hoveredNode && (t.id === hoveredNode.id) ? 1 : 0

    link.colorT += (isConnected - link.colorT) * dt * 5
    link.colorT = Math.max(0, Math.min(1, link.colorT))
  })

  context.clearRect(0, 0, width.value, height.value)
  context.save()
  context.translate(currentTransform.x, currentTransform.y)
  context.scale(currentTransform.k, currentTransform.k)

  links.forEach(link => {
    const s = link.source as NodeData
    const t = link.target as NodeData
    if (s.x == null || s.y == null || t.x == null || t.y == null) return

    const isSoftDep = props.payload.plugins[s.id].softdepend?.includes(hoveredNode?.id || '') || false
    const strokeColor = d3.interpolateRgb('gray', isSoftDep ? '#1D3A56' : '#562716')(link.colorT)

    if (!context) return
    context.beginPath()
    context.moveTo(s.x, s.y)
    context.lineTo(t.x, t.y)
    context.strokeStyle = strokeColor
    context.lineWidth = 2
    context.stroke()
  })

  nodes.forEach(node => {
    if (node.x == null || node.y == null) return

    const isSoftDep = props.payload.plugins[node.id].softdepend?.includes(hoveredNode?.id || '') || false
    const color = d3.interpolateRgb('#404040', isSoftDep ? '#1E90FF' : '#FF4500')(node.colorT)

    if (!context) return
    context.beginPath()
    context.arc(node.x, node.y, 8, 0, 2 * Math.PI)
    context.fillStyle = color
    context.fill()

    const textColor = d3.interpolateRgb('white', isSoftDep ? '#63B2FF' : '#FF8F65')(node.colorT)
    context.fillStyle = textColor
    const strokeColor = d3.interpolateRgb('purple', isSoftDep ? '#1E90FF' : '#FF4500')(node.colorT)

    context.strokeStyle = strokeColor
    context.lineWidth = 1
    if (node.x == null || node.y == null) return
    const textWidth = context.measureText(node.id).width
    context.strokeText(node.id, node.x - (textWidth / 2), node.y + 20 / currentTransform.k)
    context.fillText(node.id, node.x - (textWidth / 2), node.y + 20 / currentTransform.k)

  })

  context.restore()

  animationId = requestAnimationFrame(animate)
}

onUnmounted(() => {
  if (simulation) simulation.stop()
  if (canvasRef.value && context) {
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
  simulation = null
  context = null

  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
})
</script>
