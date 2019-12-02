import { isValidUrl } from "./url-helpers";

describe(isValidUrl.name, () => {
    it("should return true when passing in a valid URL", () => {
        const validUrls = [
            "www.google.com",
            "https://google.com",
            "http://google.com",
            "http://de.wikipedia.org/wiki/Uniform_Resource_Locator",
            "http://www.example.com/verzeichnis/unterverzeichnis/datei.html",
        ];

        validUrls.forEach((validUrl) => {
            const actual = isValidUrl(validUrl);
            expect(actual).toBe(true);
        });
    });

    it("should return false when passing in an invalid URL", () => {
        const invalidUrls = [
            "",
            " ",
            "   ",
            ".",
            "gugus",
            "shit",
            "oliver.schwendener@mail.com",
            "mailto:oliver.schwendener@mail.com",
            "gug.",
            "gooogle com",
            "www google.com",
            "www google com",
            "https:google.com",
            "https:/google.com",
        ];

        invalidUrls.forEach((invalidUrl) => {
            const actual = isValidUrl(invalidUrl);
            expect(actual).toBe(false);
        });
    });
});
