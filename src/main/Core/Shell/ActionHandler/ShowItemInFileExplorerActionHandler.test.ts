import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { ShowItemInFileExplorerActionHandler } from "./ShowItemInFileExplorerActionHandler";

describe(ShowItemInFileExplorerActionHandler, () => {
    it("should show item in file explorer", async () => {
        const showItemInFolderMock = vi.fn();
        const shell = <Shell>{ showItemInFolder: (fullPath) => showItemInFolderMock(fullPath) };

        const actionHandler = new ShowItemInFileExplorerActionHandler(shell);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "file path" });

        expect(actionHandler.id).toEqual("ShowItemInFileExplorer");
        expect(showItemInFolderMock).toHaveBeenCalledWith("file path");
    });
});
