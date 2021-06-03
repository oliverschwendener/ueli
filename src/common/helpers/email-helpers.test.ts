import { isValidEmailAddress } from "./email-helpers";

const validEmailAddresses = ["darth.vader@empire.com", "jabba-the-hutt@hutts.com", "lukeskywalker@rebels.com"];

const invalidEmailAddresses = [
    null,
    undefined,
    "",
    "  ",
    "darth.vader@",
    "darthvader",
    "darth.vader",
    "darth.vader@empire",
    "darth.vader@empire.",
    "darth.vader@mepire.c",
    "google.com",
    "https://google.com",
];

describe(isValidEmailAddress.name, () => {
    it("should return true when passing in a valid email address", () => {
        validEmailAddresses.forEach((validEmailAddress) => {
            const actual = isValidEmailAddress(validEmailAddress);
            expect(actual).toBe(true);
        });
    });

    it("should return false if passing in an invalid email address", () => {
        invalidEmailAddresses.forEach((invalidEmailAddress) => {
            const actual = isValidEmailAddress(invalidEmailAddress);
            expect(actual).toBe(false);
        });
    });
});
