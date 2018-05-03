import { MacOsSettingsExecutionArgumentValidator } from "../../../ts/execution-argument-validators/mac-os-execution-argument-validator";

describe(MacOsSettingsExecutionArgumentValidator.name, (): void => {
    const validator = new MacOsSettingsExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return false because it is not implemented yet", (): void => {
            const executionArguments = ["", "gugus", "macos:settings", "wtf"];

            for (const executionArgument of executionArguments) {
                const actual = validator.isValidForExecution(executionArgument);
                expect(actual).toBe(false);
            }
        });
    });
});
