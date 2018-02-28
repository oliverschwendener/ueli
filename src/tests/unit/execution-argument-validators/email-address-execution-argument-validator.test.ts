import { EmailAddressExecutionArgumentValidator } from "./../../../ts/execution-argument-validators/email-address-execution-argument-validator";
import { validEmailAddresses, invalidEmailAddresses } from "../test-helpers";

describe(EmailAddressExecutionArgumentValidator.name, (): void => {
    const validator = new EmailAddressExecutionArgumentValidator();

    describe(validator.isValidForExecution.name, (): void => {
        it("should return true if execution argument is an email address execution argument", (): void => {
            for (const validEmail of validEmailAddresses) {
                const executionArgument = `mailto:${validEmail}`;
                const actual = validator.isValidForExecution(executionArgument);
                expect(actual).toBe(true);
            }
        });

        it("should return false if execution argument is not an email address execution argument", (): void => {
            for (const invalidEmail of invalidEmailAddresses) {
                const executionArgument = `mailto:${invalidEmail}`;
                const actual = validator.isValidForExecution(executionArgument);
                expect(actual).toBe(false);
            }
        });
    });
});
