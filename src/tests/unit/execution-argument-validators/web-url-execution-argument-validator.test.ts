import { WebUrlExecutionArgumentValidator } from "../../../ts/execution-argument-validators/web-url-execution-argument-validator";

describe(WebUrlExecutionArgumentValidator.name, (): void => {
    const validator = new WebUrlExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true when passing in a valid argument", (): void => {
            const validInputs = [
                "google.com",
                "http://google.com",
                "https://google.com",
                "google.com/search/?query=google-something&param=value",
                "https://www.google.com/search/?query=google-something&param=value",
                "www.google.com/search/?query=google-something&param=value",
            ];

            for (const validInput of validInputs) {
                const actual = validator.isValidForExecution(validInput);
                expect(actual).toBe(true);
            }
        });

        it("should return false when passing in an invalid argument", (): void => {
            const invalidInputs = [
                "",
                "google . com",
                "http://",
                "some-bullshit",
                "12340.12",
            ];

            for (const invalidInput of invalidInputs) {
                const actual = validator.isValidForExecution(invalidInput);
                expect(actual).toBe(false);
            }
        });
    });
});
