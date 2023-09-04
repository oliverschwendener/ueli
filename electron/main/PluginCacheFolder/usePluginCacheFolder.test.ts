import type { App } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import type { FileSystemUtility } from "../Utilities";
import { usePluginCacheFolder } from "./usePluginCacheFolder";

describe(usePluginCacheFolder, () => {
    it("should ensure the plugin cache folder exists and return its folder path", async () => {
        const getPathMock = vi.fn().mockReturnValue("userData");
        const createFolderIfDoesntExistMock = vi.fn();

        const app = <App>{
            getPath: (name: string) => getPathMock(name),
        };

        const fileSystemUtility = <FileSystemUtility>{
            createFolderIfDoesntExist: (folderPath: string) => createFolderIfDoesntExistMock(folderPath),
        };

        const pluginCacheFolder = await usePluginCacheFolder({ app, fileSystemUtility });
        expect(pluginCacheFolder).toBe(join("userData", "PluginCache"));
        expect(createFolderIfDoesntExistMock).toBeCalledWith(join("userData", "PluginCache"));
    });
});
