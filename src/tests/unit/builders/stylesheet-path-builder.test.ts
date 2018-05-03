import { StylesheetPath } from "../../../ts/builders/stylesheet-path-builder";

describe("StylesheetPath", (): void => {
    it("should return the path to the mac os stylesheet", (): void => {
        const expected = "./build/css/mac.css";
        const actual = StylesheetPath.MacOs;
        expect(actual).toBe(expected);
    });

    it("should return the path to the windows stylesheet", (): void => {
        const expected = "./build/css/windows.css";
        const actual = StylesheetPath.Windows;
        expect(actual).toBe(expected);
    });
});
