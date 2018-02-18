import { expect } from "chai";
import { CommandLineSearcher } from "../../../src/ts/searcher/command-line-searcher";
import { InputOutputCombination } from "../test-helpers";
import { SearchResultItem } from "../../../src/ts/search-engine";

describe(CommandLineSearcher.name, (): void => {
    let searcher = new CommandLineSearcher();

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            let combinations = [
                <InputOutputCombination>{
                    input: ">ipconfig /flushdns",
                    output: <SearchResultItem>{
                        name: "Execute ipconfig /flushdns",
                        executionArgument: ">ipconfig /flushdns",
                    }
                },
                <InputOutputCombination>{
                    input: ">ls -la .",
                    output: <SearchResultItem>{
                        name: "Execute ls -la .",
                        executionArgument: ">ls -la ."
                    }
                }
            ];
    
            for (let combination of combinations){
                let actual = searcher.getSearchResult(combination.input);
                expect(actual.filter.length).to.equal(1);
                expect(actual[0].name).to.equal(combination.output.name);
                expect(actual[0].executionArgument).to.equal(combination.output.executionArgument);
            }
        });
    });
});
