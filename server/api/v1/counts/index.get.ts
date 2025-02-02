import { getCounts } from "~/server/utils/counter";

export default defineEventHandler(async (event) => {
  const counts = await getCounts();
  return {counts};
})
