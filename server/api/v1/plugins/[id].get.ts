import { z, zh } from "h3-zod";
import { PluginPayload } from "~/server/models/plugins.schema";

export default defineEventHandler<{body: PluginPayload}>(async (event) => {
  const { id } = await zh.useValidatedParams(event,
    z.object({
      id: z.string()
        .uuid()
    })
  );

  const response = await PluginsSchema.findById(id).select('-__v -updatedAt').lean();
  if (!response) {
    setResponseStatus(event, 404, "Plugin data not found")
    return;
  }

  return response as PluginPayload;
})
