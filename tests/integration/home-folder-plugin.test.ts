import { expect } from "chai";
import { HomeFolderSearchPlugin } from "./../../src/ts/search-plugins/home-folder-plugin";

describe("HomeFolderSearchPlugin", (): void => {
    describe("get all items", (): void => {
        it("should return more than zero search result items", (): void => {
            let homeFolderPlugin = new HomeFolderSearchPlugin();
            let actual = homeFolderPlugin.getAllItems();
            expect(actual.length).to.be.above(0);
        });

        it("all returned items should have name, execution argument and tags set", (): void => {
            let homeFolderPlugin = new HomeFolderSearchPlugin();
            let actual = homeFolderPlugin.getAllItems();

            for (let item of actual) {
                expect(item.name.length).to.be.above(0);
                expect(item.executionArgument.length).to.be.above(0);
                expect(item.tags).not.to.be.undefined;
                expect(item.tags.length).to.eql(0);
            }
        });
    });
});