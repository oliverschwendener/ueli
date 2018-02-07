import { expect } from "chai";
import { HomeFolderSearchPlugin } from "./../../src/ts/plugins/home-folder-plugin";

describe("HomeFolderPlugin", () => {
    describe("get search result", () => {
        it("should return more than zero search result items", () => {
            let homeFolderPlugin = new HomeFolderSearchPlugin();
            let actual = homeFolderPlugin.getAllItems();
            expect(actual.length).to.be.above(0);
        });

        it("all returned items should have name, execution argument and tags set", () => {
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