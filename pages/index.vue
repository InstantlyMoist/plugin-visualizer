<script lang="ts" setup>
import Footer from '~/components/footer.vue';
import BackgroundGraph from '~/components/graph/background-graph.vue';

const pluginData: PluginPayload = {
  "_id": "empty",
  "createdAt": "",
  "plugins": {
    "EssentialsX": {
      "depend": ["Vault"],
      "softdepend": ["PlaceholderAPI", "LuckPerms"]
    },
    "WorldEdit": {
      "depend": [],
      "softdepend": []
    },
    "WorldGuard": {
      "depend": ["WorldEdit"],
      "softdepend": []
    },
    "Vault": {
      "depend": [],
      "softdepend": ["LuckPerms", "EssentialsX"]
    },
    "LuckPerms": {
      "depend": [],
      "softdepend": ["Vault"]
    },
    "PlaceholderAPI": {
      "depend": [],
      "softdepend": ["Vault", "EssentialsX"]
    },
    "Citizens": {
      "depend": [],
      "softdepend": ["MythicMobs", "ProtocolLib"]
    },
    "ProtocolLib": {
      "depend": [],
      "softdepend": []
    },
    "Multiverse-Core": {
      "depend": [],
      "softdepend": ["WorldEdit"]
    },
    "CoreProtect": {
      "depend": [],
      "softdepend": []
    },
    "AuthMe": {
      "depend": [],
      "softdepend": ["ProtocolLib"]
    },
    "McMMO": {
      "depend": [],
      "softdepend": ["PlaceholderAPI"]
    },
    "Towny": {
      "depend": ["Vault"],
      "softdepend": ["Dynmap"]
    },
    "Dynmap": {
      "depend": [],
      "softdepend": []
    },
    "PlotSquared": {
      "depend": ["WorldEdit"],
      "softdepend": ["Vault"]
    },
    "MythicMobs": {
      "depend": ["ProtocolLib"],
      "softdepend": ["ModelEngine"]
    },
    "HolographicDisplays": {
      "depend": ["ProtocolLib"],
      "softdepend": []
    },
    "DiscordSRV": {
      "depend": ["PlaceholderAPI"],
      "softdepend": ["Vault"]
    },
    "AdvancedBan": {
      "depend": [],
      "softdepend": []
    },
    "Jobs": {
      "depend": ["Vault"],
      "softdepend": ["PlaceholderAPI"]
    },
    "Quests": {
      "depend": ["PlaceholderAPI"],
      "softdepend": ["Vault", "WorldGuard"]
    },
    "GriefPrevention": {
      "depend": [],
      "softdepend": ["Vault"]
    },
    "Slimefun": {
      "depend": ["CS-CoreLib"],
      "softdepend": ["ProtocolLib"]
    },
    "CS-CoreLib": {
      "depend": [],
      "softdepend": []
    },
    "HeadDatabase": {
      "depend": [],
      "softdepend": ["PlaceholderAPI"]
    },
    "ViaVersion": {
      "depend": [],
      "softdepend": []
    },
    "ClearLag": {
      "depend": [],
      "softdepend": ["PlaceholderAPI"]
    },
    "FastAsyncWorldEdit": {
      "depend": ["WorldEdit"],
      "softdepend": []
    },
    "ModelEngine": {
      "depend": ["ProtocolLib"],
      "softdepend": []
    },
    "Shopkeepers": {
      "depend": [],
      "softdepend": ["Vault", "Citizens"]
    }
  }
}

useHead({
  title: 'PluginVisualizer - Interactive Dependency Mapping for Your Project',
  meta: [
    {
      name: 'description',
      content: 'Visualize your project\'s plugin dependencies with interactive graphs. Understand relationships between plugins and manage dependencies effectively.'
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://pluginvisualizer.com/' },
    { property: 'og:title', content: 'PluginVisualizer - Interactive Dependency Mapping' },
    { property: 'og:description', content: 'Visualize your servers\'s plugin dependencies with interactive graphs.' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'PluginVisualizer - Interactive Dependency Mapping' },
    { name: 'twitter:description', content: 'Visualize your servers\'s plugin dependencies with interactive graphs.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://pluginvisualizer.com/' }
  ]
})

const features = [
  {
    title: 'Dependency Visualization',
    description: 'Understand complex plugin dependencies with interactive graphs. Visualize relationships between plugins and manage dependencies effectively.',
    icon: 'carbon:column-dependency'
  },
  {
    title: 'Interactive Graphs',
    description: 'Explore your servers\'s plugin ecosystem with interactive graphs. Hover over nodes to see dependencies and connections.',
    icon: 'material-symbols:network-node'
  },
  {
    title: 'Dependency Safeguards',
    description: 'Visualize plugin relationships to prevent accidental removal of critical dependencies. See exactly which plugins rely on others before making changes.',
    icon: 'carbon:property-relationship'
  }
]

import { useClipboard } from '@vueuse/core'
import CountUp from '~/components/text/count-up.vue';
import { NuxtLink } from '#components';

const { data } = useFetch('/api/v1/counts')

// Inside your setup script
const { copy } = useClipboard()
const copySuccess = ref(false)
const showTooltip = ref(false)
const codeBlock = ref(null)

const copyToClipboard = () => {
  if (codeBlock.value?.textContent) {
    copy(codeBlock.value.textContent)
    copySuccess.value = true
    showTooltip.value = true
    setTimeout(() => {
      copySuccess.value = false
      showTooltip.value = false
    }, 2000)
  }
}

</script>

<template>
  <Html class="scroll-smooth" lang="en">

  <Body class="bg-zinc-950 text-zinc-50">
    <NavBar />

    <main class="relative">

      <ClientOnly>
        <BackgroundGraph />
      </ClientOnly>
      <!-- Hero Section -->
      <section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          class="max-w-7xl px-4 sm:px-6 lg:px-8 py-24 mx-auto text-center relative z-10 flex flex-col items-center justify-center">
          <TextPressure class="glow text-6xl md:text-8xl lg:text-9xl mb-8" text="Visualize Your Plugin Ecosystem"
            :min-font-size="32" :flex="true" :italic="false" :dist-divisor="5" />

          <p class="text-xl font-light md:text-xl mb-8 w-full mx-24">Transform complex plugin dependencies into
            interactive graphs</p>

          <div class="flex flex-row gap-4 justify-center">
            <NuxtLink to="https://www.spigotmc.org/resources/pluginvisualizer.122356/"
              class="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 px-8 py-4 rounded-lg glow-hover transition-all duration-300 inline-flex items-center gap-2">
              <Icon name="simple-icons:spigotmc" class="text-xl" />
              Download on Spigot
            </NuxtLink>
            <NuxtLink to="https://kyllian.nl/discord" target="_blank"
              class="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 px-8 py-4 rounded-lg glow-hover transition-all duration-300 inline-flex items-center gap-2">
              <Icon name="ic:baseline-discord" class="text-xl" />
              Join the Discord
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="py-12 text-center">
        <h2 class="sr-only">Usage Statistics</h2>
        <p class="text-2xl md:text-3xl font-bold text-zinc-50">
          Over
          <span class="text-purple-400">
            <CountUp :to="Number(data?.counts.exportCount) || 0" :from="0" direction="up" :delay="0.5" :duration="2"
              separator="." class="inline" />
          </span>
          exports generated for
          <span class="text-purple-400">
            <CountUp :to="Number(data?.counts.pluginCount) || 0" :from="0" direction="up" :delay="0.5" :duration="2"
              separator="." class="inline" />
          </span>
          plugins!
        </p>
      </section>

      <section class="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <h2 class="text-4xl md:text-5xl leading-relaxed font-bold mb-6 gradient-text pb-2">
              The Power of PluginVisualizer
            </h2>
            <p class="text-zinc-300 text-lg leading-relaxed">
              Modern development environments often become complex webs of dependencies.
              PluginVisualizer cuts through the complexity with intelligent dependency mapping
              that reveals hidden relationships and potential points of failure in your plugin ecosystem.
            </p>
            <h3 class="sr-only">Key Features</h3>
            <ul class="space-y-4">
              <li class="flex items-center gap-3 text-purple-300">
                <Icon name="carbon:checkmark-filled" class="text-purple-500 text-xl" />
                <span>Discover implicit dependencies between plugins</span>
              </li>
              <li class="flex items-center gap-3 text-purple-300">
                <Icon name="carbon:checkmark-filled" class="text-purple-500 text-xl" />
                <span>Differentiate between soft and hard dependencies</span>
              </li>
              <li class="flex items-center gap-3 text-purple-300">
                <Icon name="carbon:checkmark-filled" class="text-purple-500 text-xl" />
                <span>Prevent accidental removal of critical plugins</span>
              </li>
            </ul>
          </div>
          <div class="relative group flex flex-col gap-2">
            <div
              class="border bg-[#060607] border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500/30 transition-all duration-300">
              <GraphForceDirectedGraph v-if="pluginData" class="w-full" :initial-zoom="0.5" :payload="pluginData" />
            </div>
            <div class="flex flex-row gap-2 justify-end">
              <i class="text-zinc-300 text-sm text-right">
              Click and drag to move the graph
            </i>
            <NuxtLink target="_blank" href="/visualize/03324e7d-1ee6-4cd4-8060-a0133cb03a3f">
              <Icon name="cil:fullscreen" class="hover:text-purple-500 transition-colors"/>
            </NuxtLink>
            </div>

          </div>
        </div>
      </section>

      <!-- Add this section before the closing </main> tag -->
      <section class="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl/12 md:text-4xl/10 font-bold mb-16 text-center gradient-text pb-2">
            How to use PluginVisualizer
          </h2>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Icon name="material-symbols:download" class="text-2xl text-purple-400" />
                </div>
                <h3 class="text-xl font-semibold">1. Install the Plugin</h3>
              </div>
              <p class="text-zinc-300 mb-4">
                Download and install PluginVisualizer on your Spigot server through
                the plugins directory.
              </p>
              <div class="mt-4">
                <NuxtLink to="https://www.spigotmc.org/resources/pluginvisualizer.122356/" class="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                  <Icon name="simple-icons:spigotmc" />
                  Download from SpigotMC
                </NuxtLink>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:console" class="text-2xl text-purple-400" />
                </div>
                <h3 class="text-xl font-semibold">2. Generate Data File</h3>
              </div>
              <p class="text-zinc-300 mb-4">
                Run this command in your server console or chat:
              </p>

              <div class="relative">
                <pre class="bg-zinc-900 p-4 rounded-lg text-sm pr-12 flex">
      <code ref="codeBlock" class="text-purple-300">/pluginvisualizer generate</code>
    </pre>
                <button @click="copyToClipboard" @mouseover="showTooltip = true" @mouseleave="showTooltip = false"
                  class="absolute flex right-2 top-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  aria-label="Copy command">
                  <Icon :name="copySuccess ? 'ph:check-bold' : 'ph:copy'" class="text-xl text-purple-400" />
                </button>
                <div v-if="showTooltip"
                  class="absolute right-14 top-3 bg-zinc-700 text-zinc-100 px-3 py-1 rounded-md text-sm after:content-[''] after:absolute after:top-2 after:-right-1 after:w-2 after:h-2 after:bg-zinc-700 after:rotate-45">
                  {{ copySuccess ? 'Copied!' : 'Copy to clipboard' }}
                </div>
              </div>
              <p class="text-zinc-400 text-sm mt-2">
                This uploads your plugin data to our backend server
              </p>
            </div>

            <!-- Step 3 -->
            <div class="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:graph-outline" class="text-2xl text-purple-400" />
                </div>
                <h3 class="text-xl font-semibold">3. Open the link</h3>
              </div>
              <p class="text-zinc-300 mb-4">
                Open the link provided in the chat or console to view the interactive graph.

                The link may look like <code
                  class="text-purple-300 mt-2 inline-block bg-zinc-800 px-3 py-1 rounded break-all">https://pluginvisualizer.com/visualize/&lt;UUID&gt;</code>
              </p>
            </div>
          </div>

          <div class="mt-12 text-center text-zinc-400">
            <p class="text-sm">
              <i>TIP: </i>If you're curious about the data being sent, check out the following file:<br>
              <code
                class="text-purple-300 mt-2 inline-block bg-zinc-800 px-3 py-1 rounded">/plugins/PluginVisualizer/export.json/</code>
            </p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-16 pb-2 text-center gradient-text">
            PluginVisualizer's Core Features
          </h2>

          <div class="grid md:grid-cols-3 gap-8">
            <FeatureCard v-for="(feature, index) in features" :key="index" :title="feature.title"
              :description="feature.description" :icon="feature.icon" />
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </Body>

  </Html>
</template>

<style>
.gradient-text {
  background: linear-gradient(45deg, #7c3aed, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.glow {
  text-shadow: 0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
}

.glow-hover:hover {
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
}
</style>