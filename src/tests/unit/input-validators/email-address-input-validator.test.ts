import { expect } from "chai";
import { EmailAddressInputValidator } from "./../../../ts/input-validators/email-address-input-validator";
import { invalidEmailAddresses, validEmailAddresses } from "../test-helpers";

describe(EmailAddressInputValidator.name, (): void => {
    const validator = new EmailAddressInputValidator();

    describe(validator.isValidForSearchResults.name, (): void => {
        it("should return true if user input is a valid email address", (): void => {
            for (const validEmail of validEmailAddresses) {
                const actual = validator.isValidForSearchResults(validEmail);
                expect(actual).to.be.true;
            }
        });

        it("should return false when user input is not an email address", (): void => {
            for (const invalidEmail of invalidEmailAddresses) {
                const actual = validator.isValidForSearchResults(invalidEmail);
                expect(actual).to.be.false;
            }
        });
    });
});
