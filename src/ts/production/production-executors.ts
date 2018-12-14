import { platform } from "os";
import { OperatingSystemHelpers } from "./../helpers/operating-system-helpers";
import { OperatingSystem } from "./../operating-system";
import { CommandLineExecutor } from "./../executors/command-line-executor";
import { CommandLineExecutionArgumentValidator } from "./../execution-argument-validators/command-line-execution-argument-validator";
import { UeliCommandExecutor } from "./../executors/ueli-command-executor";
import { UeliCommandExecutionArgumentValidator } from "./../execution-argument-validators/ueli-command-execution-argument-validator";
import { FilePathExecutor } from "./../executors/file-path-executor";
import { FilePathExecutionArgumentValidator } from "./../execution-argument-validators/file-path-execution-argument-validator";
import { WebSearchExecutor } from "./../executors/web-search-executor";
import { WebSearchExecutionArgumentValidator } from "./../execution-argument-validators/web-search-execution-argument-validator";
import { EmailAddressExecutionArgumentValidator } from "./../execution-argument-validators/email-address-execution-argument-validator";
import { WebUrlExecutor } from "./../executors/web-url-executor";
import { WebUrlExecutionArgumentValidator } from "./../execution-argument-validators/web-url-execution-argument-validator";
import { ExecutionArgumentValidatorExecutorCombination } from "./../execution-argument-validator-executor-combination";
import { WindowsSettingsExecutionArgumentValidator } from "./../execution-argument-validators/windows-settings-execution-argument-validator";
import { WindowsSettingsExecutor } from "./../executors/windows-settings-executor";
import { MacOsSettingsExecutor } from "./../executors/mac-os-settings-executor";
import { MacOsSettingsExecutionArgumentValidator } from "./../execution-argument-validators/mac-os-execution-argument-validator";
import { UserConfigOptions } from "./../user-config/user-config-options";
import { CustomCommandExecutor } from "./../executors/custom-command-executor";
import { ShortcutExecutionArgumentValidator } from "./../execution-argument-validators/shortcut-execution-argument-validator";
import { CalculatorExecutor } from "./../executors/calculator-executor";
import { CalculatorExecutionArgumentValidator } from "./../execution-argument-validators/calculator-execution-argument-validator";
import { WindowsAdminFilePathExecutor } from "../executors/windows-admin-file-path-executor";
import { WindowsAdminFilePathExecutionArgumentValidator } from "../execution-argument-validators/windows-admin-file-path-execution-argument-validator";

export class ProductionExecutors {
    public static getExecutionArgumentValidatorAdminExecutorCombinations(): ExecutionArgumentValidatorExecutorCombination[] {
        const os = OperatingSystemHelpers.getOperatingSystemFromString(platform());
        switch (os) {
            case OperatingSystem.Windows:
                return [
                    {
                        executor: new WindowsAdminFilePathExecutor(),
                        validator: new WindowsAdminFilePathExecutionArgumentValidator(),
                    },
                ];
            case OperatingSystem.macOS:
                return [];
        }
    }

    public static getExecutionArgumentValidatorExecutorCombinations(config: UserConfigOptions): ExecutionArgumentValidatorExecutorCombination[] {
        const result = [
            {
                executor: new CommandLineExecutor(),
                validator: new CommandLineExecutionArgumentValidator(),
            },
            {
                executor: new UeliCommandExecutor(),
                validator: new UeliCommandExecutionArgumentValidator(),
            },
            {
                executor: new FilePathExecutor(),
                validator: new FilePathExecutionArgumentValidator(),
            },
            {
                executor: new WebSearchExecutor(config.webSearches),
                validator: new WebSearchExecutionArgumentValidator(config.webSearches),
            },
            {
                executor: new FilePathExecutor(),
                validator: new EmailAddressExecutionArgumentValidator(),
            },
            {
                executor: new WebUrlExecutor(),
                validator: new WebUrlExecutionArgumentValidator(),
            },
            {
                executor: new CustomCommandExecutor(),
                validator: new ShortcutExecutionArgumentValidator(),
            },
            {
                executor: new CalculatorExecutor(),
                validator: new CalculatorExecutionArgumentValidator(),
            },
        ];

        switch (OperatingSystemHelpers.getOperatingSystemFromString(platform())) {
            case OperatingSystem.Windows: {
                result.push({
                    executor: new WindowsSettingsExecutor(),
                    validator: new WindowsSettingsExecutionArgumentValidator(),
                });
            }
            case OperatingSystem.macOS: {
                result.push({
                    executor: new MacOsSettingsExecutor(),
                    validator: new MacOsSettingsExecutionArgumentValidator(),
                });
            }
        }

        return result;
    }
}
