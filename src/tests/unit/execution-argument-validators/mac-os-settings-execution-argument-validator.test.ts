import { MacOsSettingsExecutionArgumentValidator } from "../../../ts/execution-argument-validators/mac-os-execution-argument-validator";
import { MacOsSettingsHelpers } from "../../../ts/helpers/mac-os-settings.helpers";

describe(MacOsSettingsExecutionArgumentValidator.name, (): void => {
    const validator = new MacOsSettingsExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid execution argument", (): void => {
            const executionArguments = [
                `${MacOsSettingsHelpers.macOsSettingsPrefix}do something`,
                `${MacOsSettingsHelpers.macOsSettingsPrefix}this-is-valid`,
            ];

            for (const executionArgument of executionArguments) {
                const actual = validator.isValidForExecution(executionArgument);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid execution argument", (): void => {
            const executionArguments = [
                "",
                "gugus",
                "macos:settings",
                "wtf",
                `${MacOsSettingsHelpers.macOsSettingsPrefix}`,
            ];

            for (const executionArgument of executionArguments) {
                const actual = validator.isValidForExecution(executionArgument);
                expect(actual).toBe(false);
            }
        });
    });
});
