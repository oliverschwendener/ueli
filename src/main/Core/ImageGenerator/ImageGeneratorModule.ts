import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import getFileIcon from "extract-file-icon";
import { join } from "path";
import { FileImageGenerator } from "./FileImageGenerator";
import { UrlImageGenerator } from "./UrlImageGenerator";

export class ImageGeneratorModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");

        const cacheFolderPath = join(app.getPath("userData"), "FileImageImageGenerator");

        await fileSystemUtility.createFolderIfDoesntExist(cacheFolderPath);

        dependencyRegistry.register(
            "UrlImageGenerator",
            new UrlImageGenerator(dependencyRegistry.get("SettingsManager")),
        );

        dependencyRegistry.register(
            "FileImageGenerator",
            new FileImageGenerator(cacheFolderPath, dependencyRegistry.get("FileSystemUtility"), (filePath: string) =>
                getFileIcon(filePath),
            ),
        );
    }
}
