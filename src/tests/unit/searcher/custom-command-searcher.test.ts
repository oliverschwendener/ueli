import { CustomCommandSearcher } from "../../../ts/searcher/custom-command-searcher";
import { CustomCommand } from "../../../ts/custom-shortcut";
import { InputOutputCombination, defaultShortcutIcon } from "../test-helpers";
import { SearchResultItem } from "../../../ts/search-result-item";
import { UeliHelpers } from "../../../ts/helpers/ueli-helpers";

describe(CustomCommandSearcher.name, (): void => {
    const customCommands = [
        {
            executionArgument: "!cmd.exe",
            name: "Open with command prompt:",
            prefix: "openwithcmd",
        },
    ] as CustomCommand[];

    const notMatchingUserInputs = [
        "",
        "   ",
        "something",
        "bla",
    ];

    describe("getSearchResult", (): void => {
        it("should return an empty array if no custom commands are defined", (): void => {
            const searcher = new CustomCommandSearcher([], defaultShortcutIcon);

            for (const notMatchingUserInput of notMatchingUserInputs) {
                const actual = searcher.getSearchResult(notMatchingUserInput);
                expect(actual).not.toBe(undefined);
                expect(actual.length).toBe(0);
            }
        });

        it("should return an empty array if user input does not match any custom command", (): void => {
            const searcher = new CustomCommandSearcher(customCommands, defaultShortcutIcon);

            for (const notMatchingUserInput of notMatchingUserInputs) {
                const actual = searcher.getSearchResult(notMatchingUserInput);
                expect(actual).not.toBe(undefined);
                expect(actual.length).toBe(0);
            }
        });

        it("should return the correct search result if the user input matches a custom command", (): void => {
            const searcher = new CustomCommandSearcher(customCommands, defaultShortcutIcon);

            const combinations = [
                {
                    input: "openwithcmd ipconfig /all",
                    output: {
                        executionArgument: "!cmd.exe ipconfig /all",
                        name: "Open with command prompt:",
                    } as SearchResultItem,
                },
            ] as InputOutputCombination[];

            for (const combination of combinations) {
                const actual = searcher.getSearchResult(combination.input);
                expect(actual.length).toBe(1);
                expect(actual[0].executionArgument).toBe(combination.output.executionArgument);
                expect(actual[0].name).toBe(`Open with command prompt: ipconfig /all`);
                expect(actual[0].description).toBe(UeliHelpers.customCommandDescription);
                expect(actual[0].searchable.length).toBe(0);
                expect(actual[0].tags.length).toBe(0);
            }
        });
    });
});
