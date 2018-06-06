import { Searcher } from "./searcher";
import { ConfigOptions } from "../config-options";
import { Injector } from "../injector";
import { FilePathInputValidator } from "../input-validators/file-path-input-validator";
import { SearchEngine } from "../search-engine";
import { SearchResultItem } from "../search-result-item";
import { homedir, platform } from "os";

export class VariableSearcher implements Searcher {
    private config: ConfigOptions;
    private collection: SearchResultItem[];

    constructor(config: ConfigOptions, environmentVariables: { [key: string]: string }) {
        this.config = config;
        this.collection = [];

        const validator = new FilePathInputValidator();
        const icon = Injector.getIconSet(platform()).variableIcon;
        for (const variableName of Object.keys(environmentVariables)) {
            const value = environmentVariables[variableName];
            if (validator.isValidForSearchResults(value)) {
                this.collection.push({
                    executionArgument: value,
                    icon,
                    name: `${variableName}`,
                    tags: [],
                });
            }
        }

        const customVariable = this.config.directoryVariables;
        customVariable.forEach((variable) => {
            this.collection.push({
                executionArgument: variable.path,
                icon,
                name: `${variable.name}`,
                tags: [],
            });
        });
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(this.collection, this.config.searchEngineThreshold);
        return searchEngine.search(userInput);
    }
}
