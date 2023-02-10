import { LoremIpsumOptions } from "../../../common/config/lorem-ipsum-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultLoremIpsumIcon } from "../../../common/icon/default-icons";
import { Logger } from "../../../common/logger/logger";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";

import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
})

export class LoremIpsumPlugin implements ExecutionPlugin {
    public pluginType = PluginType.LoremIpsum;

    constructor(
        private config: LoremIpsumOptions,
        private translationSet: TranslationSet,
        private clipboardCopier: (value: string) => Promise<void>,
        private readonly logger: Logger,
    ) {}

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix) && /\d*/.test(userInput.replace(this.config.prefix, ""));
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const command = userInput.replace(this.config.prefix, "").trim().split(" ")[0] || "5";
            const word: SearchResultItem = {
                description: this.translationSet.loremIpsumCopyToClipboard,
                executionArgument: "w" + command,
                hideMainWindowAfterExecution: true,
                icon: defaultLoremIpsumIcon,
                name: "Lorem Ipsum Words: " + command,
                originPluginType: this.pluginType,
                searchable: [],
            };
            const sentence: SearchResultItem = {
                description: this.translationSet.loremIpsumCopyToClipboard,
                executionArgument: "s" + command,
                hideMainWindowAfterExecution: true,
                icon: defaultLoremIpsumIcon,
                name: "Lorem Ipsum Sentences: " + command,
                originPluginType: this.pluginType,
                searchable: [],
            };
            const paragraph: SearchResultItem = {
                description: this.translationSet.loremIpsumCopyToClipboard,
                executionArgument: "p" + command,
                hideMainWindowAfterExecution: true,
                icon: defaultLoremIpsumIcon,
                name: "Lorem Ipsum Paragraphs: " + command,
                originPluginType: this.pluginType,
                searchable: [],
            };
            resolve([word, sentence, paragraph]);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        this.logger.debug("LoremIpsum");
        const args = searchResultItem.executionArgument;
        const mode = args[0];
        const value = Number(args.slice(1));
        switch(mode) {
            case "w":
                this.clipboardCopier(lorem.generateWords(value));
                break;
            case "p":
                this.clipboardCopier(lorem.generateParagraphs(value));
                break;
            default:
                this.clipboardCopier(lorem.generateSentences(value));
                break;
        }

        return Promise.resolve();
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.loremIpsumOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
