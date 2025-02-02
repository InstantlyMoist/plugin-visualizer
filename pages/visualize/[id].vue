<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const id = useRoute().params.id

const { data, error } = useFetch<PluginPayload>(`/api/v1/plugins/${id}`)
const amount = data.value?.plugins ? Object.keys(data.value.plugins).length : 0

const depend = ref<string[]>([])
const softdepend = ref<string[]>([])
const selected = ref<string | null>(null)

interface Node {
  id: string
}

useHead({
  title: `PluginVisualizer - Visualizing ${amount} plugins`,
  meta: [
    {
      name: 'description',
      content: `PluginVisualizer - Visualizing ${amount} plugins`
    }
  ]
})

const handleNodeHover = (node: Node | null) => {
  if (!node) {
    selected.value = null
    depend.value = []
    softdepend.value = []
    return
  }

  if (!data.value) return

  selected.value = node.id
  depend.value = Object.keys(data.value.plugins).filter(plugin => data.value?.plugins[plugin].depend?.includes(node.id))
  softdepend.value = Object.keys(data.value.plugins).filter(plugin => data.value?.plugins[plugin].softdepend?.includes(node.id))
}
</script>

<template>
  <div class="bg-zinc-950 text-zinc-50 h-screen">
    <div v-if="error" class="h-screen flex flex-col justify-center items-center">
      <div class="flex flex-col items-center justify-center z-50">
        <TextPressure class="max-w-3xl w-screen glow" text="Data not found" :min-font-size="12" :flex="true"
          :alpha="false" :stroke="false" :width="true" :weight="true" :italic="false" />
        <TextShiny class="italic" :text="`Data is automatically removed after 7 days`" />
      </div>
      <a href="/" class="absolute bottom-0 mb-8">
        <div class="bg-white duration-150 bg-opacity-[1%] hover:bg-opacity-[5%] rounded-lg m-4 p-4">
          <TextShiny class="text-xl" :text="`Go back to the home page`" />
        </div>
      </a>
    </div>
    <div v-else class="h-screen">
      <GraphForceDirectedGraph v-if="data" @node-hover="handleNodeHover" class="absolute top-0 left-0 w-full h-screen"
        :payload="data" />
      <div class="flex flex-col items-center z-50">
        <TextPressure class="max-w-3xl glow" text="Your Data Is Ready" :min-font-size="12" :flex="true" :alpha="false"
          :stroke="false" :width="true" :weight="true" :italic="true" />
        <TextShiny class="" :text="`You have ${amount} plugins installed`" />
      </div>
      <div class="absolute bottom-0 right-0 m-8">
        <div class="flex gap-4">
          <a href="/">
            <Icon name="material-symbols-light:home-outline" :size="32" class="color-white opacity-30 hover:opacity-50 duration-150" />
          </a>
          <a target="_blank" href="https://github.com/InstantlyMoist/plugin-visualizer">
            <Icon name="uil:github" :size="32" class="color-white opacity-30 hover:opacity-50 duration-150" />
          </a>
        </div>

      </div>
      <div class="absolute bottom-0 left-0 max-w-lg w-full">
        <div v-if="selected" class="bg-black m-4 p-4 rounded-lg">

          <TextShiny class="text-xl" :text="`${selected}`" /><br>
          <i class="text-gray-200">Depend:</i>
          <p class="text-sm">{{ depend.length > 0 ? depend.join(", ") : "None" }}</p>
          <br>
          <i class="text-gray-200">Soft Depend:</i>
          <p class="text-sm">{{ softdepend.length > 0 ? softdepend.join(", ") : "None" }}</p>

        </div>
      </div>
      <div class="glow-overlay z-0" style="--glow-color: #7c3aed"></div>
    </div>

  </div>

</template>

<style></style>