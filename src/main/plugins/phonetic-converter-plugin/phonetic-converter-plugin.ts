// FIXME(flechnical): When typing too many characters the result text gets cut off. Find a way to cut off the result text at the left side or enable multi-line for results.

import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PhoneticConverterOptions } from "../../../common/config/phonetic-converter-options";
import { defaultPhoneticIcon } from "../../../common/icon/default-icons";
import { PhoneticConverter } from "./phonetic-converter";

export class PhoneticConverterPlugin implements ExecutionPlugin {
  public pluginType = PluginType.PhoneticConverter;
  private config: PhoneticConverterOptions;
  // private translationSet: TranslationSet;
  private readonly clipboardCopier: (value: string) => Promise<void>;

  constructor(
    config: PhoneticConverterOptions,
    // translationSet: TranslationSet,
    clipboardCopier: (value: string) => Promise<void>
  ) {
    this.config = config;
    // this.translationSet = translationSet;
    this.clipboardCopier = clipboardCopier;
  }

  public isValidUserInput(userInput: string): boolean {
    return (
      userInput.startsWith(this.config.prefix) &&
      userInput.replace(this.config.prefix, "").length > 0
    );
  }

  public getSearchResults(
    userInput: string,
    fallback?: boolean | undefined
  ): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
      const strippedInput: string = userInput.replace(this.config.prefix, "");
      const resultsArray: SearchResultItem[] = [];
      if (this.config.enableEnglish) {
        const englishResult: string = PhoneticConverter.convert(
          strippedInput,
          "eng"
        );
        resultsArray.push({
          description: `Press enter to copy your input: ${strippedInput}`,
          executionArgument: englishResult,
          hideMainWindowAfterExecution: true,
          icon: defaultPhoneticIcon,
          name: `${englishResult}`,
          originPluginType: this.pluginType,
          searchable: [],
        });
      }
      if (this.config.enableGerman) {
        const germanResult: string = PhoneticConverter.convert(
          strippedInput,
          "ger"
        );
        resultsArray.push({
          description: `Press enter to copy your input: ${strippedInput}`,
          executionArgument: germanResult,
          hideMainWindowAfterExecution: true,
          icon: defaultPhoneticIcon,
          name: `${germanResult}`,
          originPluginType: this.pluginType,
          searchable: [],
        });
      }
      resolve(resultsArray);
    });
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public execute(
    searchResultItem: SearchResultItem,
    privileged: boolean
  ): Promise<void> {
    return this.clipboardCopier(
      searchResultItem.description.replace(
        "Press enter to copy your input: ",
        ""
      )
    ); // TODO(flechnical): adapt this so it also works with other languages; search for ": "?
  }

  public updateConfig(
    updatedConfig: UserConfigOptions,
    translationSet: TranslationSet
  ): Promise<void> {
    return new Promise((resolve) => {
      this.config = updatedConfig.phoneticConverterOptions;
      // this.translationSet = translationSet;
      resolve();
    });
  }
}
