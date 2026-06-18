import { describe, expect, it } from "vitest";
import { getRecentUri, isPath, mergeRecents } from "./VSCodeExtension";

describe(mergeRecents, () => {
    it("should merge lists in order and deduplicate by uri", () => {
        const local = [{ folderUri: "file:///home/user/project-a" }, { folderUri: "file:///home/user/project-b" }];
        const remote = [
            { folderUri: "vscode-vfs://github/org/repo" },
            { folderUri: "file:///home/user/project-a" },
        ];

        expect(mergeRecents(local, remote)).toEqual([
            { folderUri: "file:///home/user/project-a" },
            { folderUri: "file:///home/user/project-b" },
            { folderUri: "vscode-vfs://github/org/repo" },
        ]);
    });

    it("should support workspace config paths", () => {
        const entries = [{ workspace: { id: "abc", configPath: "file:///home/user/workspace.code-workspace" } }];

        expect(getRecentUri(entries[0])).toBe("file:///home/user/workspace.code-workspace");
        expect(mergeRecents(entries)).toEqual(entries);
    });
});

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
