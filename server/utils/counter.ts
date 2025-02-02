export async function getCounts() {
  const db = await useStorage('db')
  const exportCount = await db.getItem('exportCount') 
  const pluginCount = await db.getItem('pluginCount')
  return {
    exportCount,
    pluginCount,
  }
}

export async function incrementExportCount() {
  const db = await useStorage('db')
  const exportCount = await db.getItem<number>('exportCount') || 0
  await db.setItem('exportCount', exportCount + 1)
}

export async function incrementPluginCount(amount : number) {
  const db = await useStorage('db')
  const pluginCount = await db.getItem<number>('pluginCount') || 0
  await db.setItem('pluginCount', pluginCount + amount)
}