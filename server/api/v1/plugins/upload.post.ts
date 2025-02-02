import { zh } from "h3-zod"
import { PluginsSchema } from "#imports"
import { PluginPayloadSchema } from "~/server/models/plugins.schema"
import { incrementExportCount, incrementPluginCount } from "~/server/utils/counter"

export default defineEventHandler(async (event) => {
  const body = await zh.useValidatedBody(event, PluginPayloadSchema) 

  const response = await PluginsSchema.create(body)

  incrementExportCount();
  incrementPluginCount(Object.keys(body.plugins).length);
  
  const insertedId = response?._id
  if (!insertedId) {
    throw new Error('Failed to insert plugin')
  }

  return insertedId
})
