import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { describe, expect, it, vi } from "vitest";
import { AppleScriptUtility } from "./AppleScriptUtility";

describe(AppleScriptUtility, () => {
    it("should execute an apple script", async () => {
        const commandlineUtility = <CommandlineUtility>{ executeCommand: vi.fn() };

        await new AppleScriptUtility(commandlineUtility).executeAppleScript("test");

        expect(commandlineUtility.executeCommand).toHaveBeenCalledWith("osascript -e 'test'");
    });
});
