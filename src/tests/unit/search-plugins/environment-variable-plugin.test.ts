import { EnvironmentVariablePlugin } from "../../../ts/search-plugins/environment-variable-plugin";

describe(EnvironmentVariablePlugin.name, (): void => {
    const fakeEnvironmentVariableCollection = {
        path1: "path-1",
        path2: "path-2",
        path3: "path-3",
    };

    const plugin = new EnvironmentVariablePlugin(fakeEnvironmentVariableCollection);

    describe(plugin.getAllItems.name, (): void => {
        it("should return an search result item for each item in the environment variable collection", (): void => {
            const actual = plugin.getAllItems();

            expect(actual.length).toBe(Object.keys(fakeEnvironmentVariableCollection).length);

            for (const key of Object.keys(fakeEnvironmentVariableCollection)) {
                const item = actual.filter((a) => a.name === key)[0];
                expect(item).not.toBe(undefined);
                expect(item).not.toBe(null);
            }
        });
    });
});
