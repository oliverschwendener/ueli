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
import { UserConfigOptions } from "./../user-config/user-config-options";
import { CountManager } from "./../count/count-manager";
import { CountFileRepository } from "./../count/count-file-repository";
import { CustomCommandSearcher } from "./../searcher/custom-command-searcher";
import { CustomCommandInputValidator } from "./../input-validators/custom-command-input-validator";
import { ProductionSearchPluginManager } from "../production-search-plugin-manager";
import { IconStore } from "../icon-service/icon-store";
import { AppConfig } from "../app-config/app-config";

export class ProductionSearchers {
    public static getCombinations(config: UserConfigOptions, appConfig: AppConfig, iconStore: IconStore): InputValidatorSearcherCombination[] {
        const countManager = new CountManager(new CountFileRepository(appConfig.countFilePath));
        const environmentVariableCollection = process.env as { [key: string]: string };

        const result: InputValidatorSearcherCombination[] = [];

        if (config.features.calculator) {
            result.push({
                searcher: new CalculatorSearcher(config.iconSet),
                validator: new CalculatorInputValidator(),
            });
        }

        if (config.features.fileBrowser) {
            result.push({
                searcher: new FilePathSearcher(config.searchEngineThreshold, config.searchEngineLimit, config.iconSet),
                validator: new FilePathInputValidator(),
            });
        }

        if (config.features.commandLine) {
            result.push({
                searcher: new CommandLineSearcher(config.iconSet),
                validator: new CommandLineInputValidator(),
            });
        }

        if (config.features.webSearch) {
            result.push({
                searcher: new WebSearchSearcher(config.webSearches),
                validator: new WebSearchInputValidator(config.webSearches),
            });
        }

        if (config.features.email) {
            result.push({
                searcher: new EmailAddressSearcher(config.iconSet),
                validator: new EmailAddressInputValidator(),
            });
        }

        if (config.features.webUrl) {
            result.push({
                searcher: new WebUrlSearcher(config.iconSet),
                validator: new WebUrlInputValidator(),
            });
        }

        if (config.features.customCommands) {
            result.push({
                searcher: new CustomCommandSearcher(config.customCommands, config.iconSet.shortcutIcon),
                validator: new CustomCommandInputValidator(config.customCommands),
            });
        }

        result.push({
            searcher: new SearchPluginsSearcher(config, countManager, new ProductionSearchPluginManager(config, environmentVariableCollection), iconStore),
            validator: new SearchPluginsInputValidator(),
        });

        return result;
    }
}
