import { FakeSearchPlugin } from "../fake-search-plugin";
import { SearchResultItem } from "../../../ts/search-result-item";

describe(FakeSearchPlugin.name, (): void => {
    const items = [] as SearchResultItem[];
    const plugin = new FakeSearchPlugin(items);

    describe(plugin.getAllItems.name, (): void => {
        it("should return all items", (): void => {
            const actual = plugin.getAllItems();
            expect(actual.length).toBe(items.length);
        });
    });

    describe(plugin.getIndexLength.name, (): void => {
        it("should return the items count", (): void => {
            const actual = plugin.getIndexLength();
            expect(actual).toBe(items.length);
        });
    });
});
