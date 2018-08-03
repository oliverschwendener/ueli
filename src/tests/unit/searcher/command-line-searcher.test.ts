import { SearchResultItem } from "../../../ts/search-result-item";
import { CommandLineSearcher } from "../../../ts/searcher/command-line-searcher";
import { InputOutputCombination } from "../test-helpers";

describe(CommandLineSearcher.name, (): void => {
    const searcher = new CommandLineSearcher();

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            const combinations = [
                {
                    input: ">ipconfig /flushdns",
                    output: {
                        executionArgument: ">ipconfig /flushdns",
                        name: "ipconfig /flushdns",
                    } as SearchResultItem,
                } as InputOutputCombination,
                {
                    input: ">ls -la .",
                    output: {
                        executionArgument: ">ls -la .",
                        name: "ls -la .",
                    } as SearchResultItem,
                } as InputOutputCombination,
            ];

            for (const combination of combinations) {
                const actual = searcher.getSearchResult(combination.input);
                expect(actual.filter.length).toBe(1);
                expect(actual[0].name).toBe(combination.output.name);
                expect(actual[0].executionArgument).toBe(combination.output.executionArgument);
            }
        });
    });
});
