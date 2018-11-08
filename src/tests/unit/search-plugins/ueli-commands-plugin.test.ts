import { UeliCommandsSearchPlugin } from "../../../ts/search-plugins/ueli-commands-plugin";

describe(UeliCommandsSearchPlugin.name, (): void => {
    const plugin = new UeliCommandsSearchPlugin();

    describe(plugin.getAllItems.name, (): void => {
        it("should return all items", (): void => {
            const actual = plugin.getAllItems();
            expect(actual.length).toBe(3);
        });
    });

    describe(plugin.getIndexLength.name, (): void => {
        it("should return the count of items", (): void => {
            const actual = plugin.getIndexLength();
            expect(actual).toBe(3);
        });
    });
});
