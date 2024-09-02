import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import { join } from "path";
import { CacheFileNameGenerator } from "./CacheFileNameGenerator";
import type { FileIconExtractor } from "./FileIconExtractor";
import { FileImageGenerator } from "./FileImageGenerator";
import { GenericFileIconExtractor } from "./GenericFileIconExtractor";
import { LinuxAppIconExtractor } from "./Linux";
import { UrlImageGenerator } from "./UrlImageGenerator";
import { WindowsApplicationIconExtractor, WindowsFolderIconExtractor } from "./Windows";
import { MacOsApplicationIconExtractor, MacOsFolderIconExtractor } from "./macOS";

export class ImageGeneratorModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register(
            "UrlImageGenerator",
            new UrlImageGenerator(dependencyRegistry.get("SettingsManager")),
        );

        const cacheFolderPath = await ImageGeneratorModule.ensureCacheFolderExists(dependencyRegistry);

        dependencyRegistry.register(
            "FileImageGenerator",
            new FileImageGenerator([
                ...ImageGeneratorModule.getOperatingSystemSpecificIconGenerators(cacheFolderPath, dependencyRegistry),
                new GenericFileIconExtractor(dependencyRegistry.get("App")),
            ]),
        );
    }

    private static async ensureCacheFolderExists(
        dependencyRegistry: DependencyRegistry<Dependencies>,
    ): Promise<string> {
        const app = dependencyRegistry.get("App");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const cacheFolderPath = join(app.getPath("userData"), "FileImageImageGenerator");
        await fileSystemUtility.createFolderIfDoesntExist(cacheFolderPath);
        return cacheFolderPath;
    }

    private static getOperatingSystemSpecificIconGenerators(
        cacheFolderPath: string,
        dependencyRegistry: DependencyRegistry<Dependencies>,
    ): FileIconExtractor[] {
        const cacheFileNameGenerator = new CacheFileNameGenerator();

        // To prevent the execution of all icon extractor constructors, we use a function here that is only invoked
        // for the current operating system.
        const operatingSystemSpecificIconExtractors: Record<OperatingSystem, () => FileIconExtractor[]> = {
            Linux: () =>
                ["Cinnamon", "GNOME", "KDE", "MATE", "XFCE", "Pantheon"].includes(
                    dependencyRegistry.get("LinuxDesktopEnvironmentResolver").resolve(),
                )
                    ? [
                          new LinuxAppIconExtractor(
                              dependencyRegistry.get("FileSystemUtility"),
                              dependencyRegistry.get("CommandlineUtility"),
                              dependencyRegistry.get("IniFileParser"),
                              dependencyRegistry.get("Logger"),
                              cacheFileNameGenerator,
                              cacheFolderPath,
                              dependencyRegistry.get("App").getPath("home"),
                              dependencyRegistry.get("EnvironmentVariableProvider"),
                              dependencyRegistry.get("LinuxDesktopEnvironmentResolver"),
                          ),
                      ]
                    : [],
            macOS: () => [
                new MacOsFolderIconExtractor(
                    dependencyRegistry.get("AssetPathResolver"),
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("App"),
                ),
                new MacOsApplicationIconExtractor(
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("CommandlineUtility"),
                    cacheFileNameGenerator,
                    cacheFolderPath,
                ),
            ],
            Windows: () => [
                new WindowsFolderIconExtractor(
                    dependencyRegistry.get("AssetPathResolver"),
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("App"),
                ),
                new WindowsApplicationIconExtractor(
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("PowershellUtility"),
                    cacheFileNameGenerator,
                    cacheFolderPath,
                ),
            ],
        };

        return operatingSystemSpecificIconExtractors[dependencyRegistry.get("OperatingSystem")]();
    }
}
