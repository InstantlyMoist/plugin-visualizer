export default defineTask({
    meta: {
        name: "remove_old",
        description: "Remove expired data from the database",
    },
    async run({ payload, context }) {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const idsToDelete = (await PluginsSchema.find({ createdAt: { $lte: new Date(now - oneWeek) } }))
            .map(data => data._id);

        if (idsToDelete.length === 0) {
            console.log("No data to remove");
            return { result: "No data to remove" };
        }

        console.log(`Successfully removed ${idsToDelete.length} old data`);
        await PluginsSchema.deleteMany({ _id: { $in: idsToDelete } });
        return { result: "Success" };
    },
});