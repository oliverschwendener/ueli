import { ShortcutsPlugin } from "../../../ts/search-plugins/shortcuts-plugin";
import { Shortcut } from "../../../ts/shortcut";

describe(ShortcutsPlugin.name, (): void => {
    describe("getAllItems", (): void => {
        it("should set the execution argument correctly", (): void => {
            const shortcuts: Shortcut[] = [
                {
                    executionArgument: "execution-argument",
                    icon: "icon",
                    name: "Custom Shortcut 1",
                },
                {
                    executionArgument: "execution-argument-2",
                    icon: "icon",
                    name: "Custom Shortcut 2",
                },
            ];

            const plugin = new ShortcutsPlugin(shortcuts, "");

            const actual = plugin.getAllItems();

            for (const item of actual) {
                const shortcut = shortcuts.filter((c: Shortcut): boolean => {
                    return c.name === item.name;
                })[0];

                expect(shortcut).not.toBe(undefined);
                expect(item.executionArgument).toBe(shortcut.executionArgument);
            }
        });

        it("should set the deafult icon if no icon is specified", (): void => {
            const defaultIcon = "this is the default icon";

            const shortcuts = [
                {
                    executionArgument: "execution-argument",
                    name: "Custom Shortcut 1",
                },
                {
                    executionArgument: "execution-argument-2",
                    name: "Custom Shortcut 2",
                },
            ] as Shortcut[];

            const plugin = new ShortcutsPlugin(shortcuts, defaultIcon);

            const actual = plugin.getAllItems();

            for (const item of actual) {
                const shortcut = shortcuts.filter((c: Shortcut): boolean => {
                    return c.name === item.name;
                })[0];

                expect(shortcut).not.toBe(undefined);
                expect(item.icon).toBe(defaultIcon);
            }
        });

        it("should set the given icon if it is specified", (): void => {
            const defaultIcon = "this is the default icon";

            const shortcuts: Shortcut[] = [
                {
                    executionArgument: "execution-argument",
                    icon: "another icon",
                    name: "Custom Shortcut 1",
                },
                {
                    executionArgument: "execution-argument-2",
                    icon: "another icon 2",
                    name: "Custom Shortcut 2",
                },
            ];

            const plugin = new ShortcutsPlugin(shortcuts, defaultIcon);

            const actual = plugin.getAllItems();

            for (const item of actual) {
                const shortcut = shortcuts.filter((c: Shortcut): boolean => {
                    return c.name === item.name;
                })[0];

                expect(shortcut).not.toBe(undefined);
                expect(item.icon).toBe(shortcut.icon);
            }
        });
    });

    describe("getIndexLength", (): void => {
        it("should return the number of shortcuts", (): void => {
            const shortcuts: Shortcut[] = [
                { executionArgument: "execution-argument-1", name: "shortcut-1", icon: "icon" },
                { executionArgument: "execution-argument-2", name: "shortcut-2", icon: "icon" },
                { executionArgument: "execution-argument-3", name: "shortcut-3", icon: "icon" },
                { executionArgument: "execution-argument-4", name: "shortcut-4", icon: "icon" },
            ];

            const shortcutPlugin = new ShortcutsPlugin(shortcuts, "default-shortcut-icon");

            const actual = shortcutPlugin.getIndexLength();
            const expected = shortcuts.length;

            expect(actual).toBe(expected);
        });
    });
});
