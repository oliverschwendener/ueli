import { isValidJson, mergeUserConfigWithDefault } from "./config-helpers";
import { defaultUserConfigOptions } from "../config/user-config-options";
import { UserConfigOptions } from "../config/user-config-options";

describe(isValidJson.name, () => {
    it("should return true if valid json is passed in", () => {
        const validElements = [
            {},
            [],
            {
                property: "my-property",
                property2: 2,
                property3: true,
            },
            "undefined",
            "null",
        ];

        validElements.forEach((validElement) => {
            const actual = isValidJson(JSON.stringify(validElement));
            expect(actual).toBe(true);
        });
    });

    it("should return false if invalid json is passed in", () => {
        const invalidElements = ["blabla", "{'1kc$$asdf90c"];

        invalidElements.forEach((invalidElement) => {
            const actual = isValidJson(invalidElement);
            expect(actual).toBe(false);
        });
    });
});

describe(mergeUserConfigWithDefault.name, () => {
    it("should not modify default config when passing in an empty object", () => {
        const object = {};
        const actual = mergeUserConfigWithDefault(object, defaultUserConfigOptions);
        expect(JSON.stringify(actual)).toBe(JSON.stringify(defaultUserConfigOptions));
    });

    it("should apply the passed object to the default config", () => {
        const object = {
            urlOptions: {
                defaultProtocol: "ftp",
            },
        } as UserConfigOptions;

        const actual = mergeUserConfigWithDefault(object, defaultUserConfigOptions);
        expect(actual.urlOptions.defaultProtocol).toBe("ftp");
        expect(actual.fileBrowserOptions.maxSearchResults).toBe(
            defaultUserConfigOptions.fileBrowserOptions.maxSearchResults,
        );
    });
});
