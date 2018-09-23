import { CalculatorSearcher } from "./../searcher/calculator-searcher";
import { CalculatorInputValidator } from "./../input-validators/calculator-input-validator";
import { FilePathSearcher } from "./../searcher/file-path-searcher";
import { FilePathInputValidator } from "./../input-validators/file-path-input-validator";
import { CommandLineSearcher } from "./../searcher/command-line-searcher";
import { CommandLineInputValidator } from "./../input-validators/command-line-input-validator";
import { WebSearchSearcher } from "./../searcher/web-search-searcher";
import { WebSearchInputValidator } from "./../input-validators/web-search-input-validator";
import { EmailAddressSearcher } from "./../searcher/email-address-searcher";
import { EmailAddressInputValidator } from "./../input-validators/email-address-input-validator";
import { WebUrlSearcher } from "./../searcher/web-url-searcher";
import { WebUrlInputValidator } from "./../input-validators/web-url-input-validator";
import { SearchPluginsSearcher } from "./../searcher/search-plugins-searcher";
import { SearchPluginsInputValidator } from "./../input-validators/search-plugins-input-validator";
import { InputValidatorSearcherCombination } from "./../input-validator-searcher-combination";
import { UeliHelpers } from "./../helpers/ueli-helpers";
import { UserConfigOptions } from "./../user-config/user-config-options";
import { CountManager } from "./../count/count-manager";
import { CountFileRepository } from "./../count/count-file-repository";
import { CustomCommandSearcher } from "./../searcher/custom-command-searcher";
import { CustomCommandInputValidator } from "./../input-validators/custom-command-input-validator";

export class ProductionSearchers {
    public static getCombinations(config: UserConfigOptions): InputValidatorSearcherCombination[] {
        const countManager = new CountManager(new CountFileRepository(UeliHelpers.countFilePath));
        const environmentVariableCollection = process.env as { [key: string]: string };

        return [
            {
                searcher: new CalculatorSearcher(),
                validator: new CalculatorInputValidator(),
            },
            {
                searcher: new FilePathSearcher(config.searchEngineThreshold, config.iconSet),
                validator: new FilePathInputValidator(),
            },
            {
                searcher: new CommandLineSearcher(),
                validator: new CommandLineInputValidator(),
            },
            {
                searcher: new WebSearchSearcher(config.webSearches),
                validator: new WebSearchInputValidator(config.webSearches),
            },
            {
                searcher: new EmailAddressSearcher(config.iconSet),
                validator: new EmailAddressInputValidator(),
            },
            {
                searcher: new WebUrlSearcher(),
                validator: new WebUrlInputValidator(),
            },
            {
                searcher: new CustomCommandSearcher(config.customCommands, config.iconSet.shortcutIcon),
                validator: new CustomCommandInputValidator(config.customCommands),
            },
            {
                searcher: new SearchPluginsSearcher(config, countManager, config.iconSet, environmentVariableCollection),
                validator: new SearchPluginsInputValidator(),
            },
        ];
    }
}
