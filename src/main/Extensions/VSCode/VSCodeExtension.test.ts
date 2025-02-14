import { describe, expect, it } from "vitest";
import { isPath } from "./VSCodeExtension";

describe(isPath, () => {
    it("should return true for absolute unix style absolute paths", () => {
        expect(isPath("/home/developer/foo")).toBe(true);
    });

    it.each(["home/developer/foo", "", null, undefined, "scripts", "test.workspace", "file://path/to/uri"])(
        'should return false for "%s" not starting with /',
        (path) => {
            expect(isPath(path)).toBe(false);
        },
    );
    it.each(["C:\\Users\\developer\\foo"])('should return true for absolute windows paths "%s"', (path) => {
        expect(isPath(path)).toBe(true);
    });
});
