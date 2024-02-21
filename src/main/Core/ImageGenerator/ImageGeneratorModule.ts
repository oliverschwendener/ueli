import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { FileImageGenerator } from "./FileImageGenerator";
import { UrlImageGenerator } from "./UrlImageGenerator";

export class ImageGeneratorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register(
            "UrlImageGenerator",
            new UrlImageGenerator(dependencyRegistry.get("SettingsManager")),
        );

        dependencyRegistry.register(
            "FileImageGenerator",
            new FileImageGenerator(
                dependencyRegistry.get("ExtensionCacheFolder"),
                dependencyRegistry.get("FileSystemUtility"),
            ),
        );
    }
}
