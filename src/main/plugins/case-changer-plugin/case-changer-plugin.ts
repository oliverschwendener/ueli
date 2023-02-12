import { CaseChangerOptions } from "../../../common/config/case-changer-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultCaseChangerIcon } from "../../../common/icon/default-icons";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase } from "change-case";


export class CaseChangerPlugin implements ExecutionPlugin {
    public pluginType = PluginType.CaseChangerPlugin;

    constructor(
        private config: CaseChangerOptions,
        private translationSet: TranslationSet,
        private clipboardCopier: (value: string) => Promise<void>,
    ) {}

    private generateResult(text: string, description: string): SearchResultItem {
        return {
            description: description + ", " + this.translationSet.caseChangerCopyToClipboard,
            executionArgument: text,
            hideMainWindowAfterExecution: true,
            icon: defaultCaseChangerIcon,
            name: text,
            originPluginType: this.pluginType,
            searchable: [],
        }
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix) && userInput.replace(this.config.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const text = userInput.replace(this.config.prefix, "").trim();
            resolve([
                this.generateResult(camelCase(text), "CamelCase"),
                this.generateResult(snakeCase(text), "snake_case"),
                this.generateResult(paramCase(text), "param-case"),
                this.generateResult(pascalCase(text), "PascalCase"),
                this.generateResult(constantCase(text), "CONSTANT_CASE"),
                this.generateResult(dotCase(text), "dot.case"),
                this.generateResult(headerCase(text), "Header-Case"),
                this.generateResult(pathCase(text), "path/case"),
                this.generateResult(capitalCase(text), "Capital Case"),
                this.generateResult(sentenceCase(text), "Sentence case"),
                this.generateResult(noCase(text), "no case"),
            ] as SearchResultItem[]);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        this.clipboardCopier(searchResultItem.executionArgument);
        return Promise.resolve();
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.caseChangerOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
