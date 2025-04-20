import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { OperatingSystem } from "@common/Core";
import { join } from "path";
import { CacheFileNameGenerator } from "./CacheFileNameGenerator";
import { DuckDuckGoFaviconProvider, FaviconeFaviconProvider, GoogleFaviconProvider } from "./FaviconProvider";
import type { FileIconExtractor } from "./FileIconExtractor";
import { FileImageGenerator } from "./FileImageGenerator";
import { GenericFileIconExtractor } from "./GenericFileIconExtractor";
import { LinuxAppIconExtractor } from "./Linux";
import { UrlImageGenerator } from "./UrlImageGenerator";
import { WindowsApplicationIconExtractor, WindowsFolderIconExtractor } from "./Windows";
import { MacOsApplicationIconExtractor, MacOsFolderIconExtractor } from "./macOS";

export class ImageGeneratorModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register(
            "UrlImageGenerator",
            new UrlImageGenerator(moduleRegistry.get("SettingsManager"), {
                Google: new GoogleFaviconProvider(),
                DuckDuckGo: new DuckDuckGoFaviconProvider(),
                Favicone: new FaviconeFaviconProvider(),
            }),
        );

        const cacheFolderPath = await ImageGeneratorModule.ensureCacheFolderExists(moduleRegistry);

        moduleRegistry.register(
            "FileImageGenerator",
            new FileImageGenerator([
                ...ImageGeneratorModule.getOperatingSystemSpecificIconGenerators(cacheFolderPath, moduleRegistry),
                new GenericFileIconExtractor(moduleRegistry.get("App")),
            ]),
        );
    }

    private static async ensureCacheFolderExists(moduleRegistry: UeliModuleRegistry): Promise<string> {
        const app = moduleRegistry.get("App");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");
        const cacheFolderPath = join(app.getPath("userData"), "FileImageImageGenerator");
        await fileSystemUtility.createFolderIfDoesntExist(cacheFolderPath);
        return cacheFolderPath;
    }

    private static getOperatingSystemSpecificIconGenerators(
        cacheFolderPath: string,
        moduleRegistry: UeliModuleRegistry,
    ): FileIconExtractor[] {
        const cacheFileNameGenerator = new CacheFileNameGenerator();

        const currentDesktopEnvironment = moduleRegistry.get("LinuxDesktopEnvironmentResolver").resolve();

        // To prevent the execution of all icon extractor constructors, we use a function here that is only invoked
        // for the current operating system.
        const operatingSystemSpecificIconExtractors: Record<OperatingSystem, () => FileIconExtractor[]> = {
            Linux: () =>
                currentDesktopEnvironment &&
                ["Cinnamon", "GNOME", "KDE", "MATE", "XFCE", "Pantheon"].includes(currentDesktopEnvironment)
                    ? [
                          new LinuxAppIconExtractor(
                              moduleRegistry.get("FileSystemUtility"),
                              moduleRegistry.get("CommandlineUtility"),
                              moduleRegistry.get("IniFileParser"),
                              moduleRegistry.get("Logger"),
                              cacheFileNameGenerator,
                              cacheFolderPath,
                              moduleRegistry.get("App").getPath("home"),
                              moduleRegistry.get("EnvironmentVariableProvider"),
                              moduleRegistry.get("LinuxDesktopEnvironmentResolver"),
                          ),
                      ]
                    : [],
            macOS: () => [
                new MacOsFolderIconExtractor(
                    moduleRegistry.get("AssetPathResolver"),
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("App"),
                ),
                new MacOsApplicationIconExtractor(
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("CommandlineUtility"),
                    cacheFileNameGenerator,
                    cacheFolderPath,
                ),
            ],
            Windows: () => [
                new WindowsFolderIconExtractor(
                    moduleRegistry.get("AssetPathResolver"),
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("App"),
                ),
                new WindowsApplicationIconExtractor(
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("PowershellUtility"),
                    cacheFileNameGenerator,
                    cacheFolderPath,
                ),
            ],
        };

        return operatingSystemSpecificIconExtractors[moduleRegistry.get("OperatingSystem")]();
    }
}
