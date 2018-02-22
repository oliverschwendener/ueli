import { expect } from "chai";
import { HomeFolderSearchPlugin } from "../../../ts/search-plugins/home-folder-plugin";

describe(HomeFolderSearchPlugin.name, (): void => {
    const plugin = new HomeFolderSearchPlugin();

    describe(plugin.getAllItems.name, (): void => {
        it("should return more than zero search result items", (): void => {
            const actual = plugin.getAllItems();
            expect(actual.length).to.be.above(0);
        });

        it("all returned items should have name, execution argument and tags set", (): void => {
            const actual = plugin.getAllItems();

            for (const item of actual) {
                expect(item.name.length).to.be.above(0);
                expect(item.executionArgument.length).to.be.above(0);
                expect(item.tags).not.to.be.undefined;
                expect(item.tags.length).to.eql(0);
            }
        });
    });
});
