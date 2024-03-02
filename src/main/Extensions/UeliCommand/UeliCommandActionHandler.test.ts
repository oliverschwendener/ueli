import type { UeliCommand, UeliCommandInvoker } from "@Core/UeliCommand";
import { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";

describe(UeliCommandActionHandler, () => {
    const testInvokeAction = async ({
        expectedUeliCommand,
        searchResultItemAction,
    }: {
        expectedUeliCommand: UeliCommand;
        searchResultItemAction: SearchResultItemAction;
    }) => {
        const invokeUeliCommandMock = vi.fn().mockReturnValue(Promise.resolve());
        const ueliCommandInvoker = <UeliCommandInvoker>{ invokeUeliCommand: (u) => invokeUeliCommandMock(u) };

        const ueliCommandActionHandler = new UeliCommandActionHandler(ueliCommandInvoker);

        expect(ueliCommandActionHandler.id).toBe("UeliCommand");

        await ueliCommandActionHandler.invokeAction(searchResultItemAction);

        expect(invokeUeliCommandMock).toHaveBeenCalledWith(expectedUeliCommand);
    };

    it("should invoke an ueli command", async () => {
        await testInvokeAction({
            searchResultItemAction: <SearchResultItemAction>{ argument: "quit" },
            expectedUeliCommand: "quit",
        });

        await testInvokeAction({
            searchResultItemAction: <SearchResultItemAction>{ argument: "settings" },
            expectedUeliCommand: "openSettings",
        });

        await testInvokeAction({
            searchResultItemAction: <SearchResultItemAction>{ argument: "extensions" },
            expectedUeliCommand: "openExtensions",
        });

        await testInvokeAction({
            searchResultItemAction: <SearchResultItemAction>{ argument: "centerWindow" },
            expectedUeliCommand: "centerWindow",
        });
    });

    it("should throw an error if the argument is an invalid ueli command", async () => {
        const invokeUeliCommandMock = vi.fn().mockReturnValue(Promise.resolve());
        const ueliCommandInvoker = <UeliCommandInvoker>{ invokeUeliCommand: (u) => invokeUeliCommandMock(u) };
        const ueliCommandActionHandler = new UeliCommandActionHandler(ueliCommandInvoker);

        await expect(
            ueliCommandActionHandler.invokeAction(<SearchResultItemAction>{ argument: "unknown" }),
        ).rejects.toThrowError("Unexpected argument: unknown");
    });
});
