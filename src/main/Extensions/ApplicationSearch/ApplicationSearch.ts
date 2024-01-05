import type { ExtensionSettingList, ExtensionSettingsStructure } from "@common/ExtensionSettingsStructure";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { App } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../../DependencyInjector";
import type { Extension } from "../../Extension";
import type { ApplicationRepository } from "./ApplicationRepository";

export class ApplicationSearch implements Extension {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "extension[ApplicationSearch].extensionName";

    public constructor(private readonly applicationRepository: ApplicationRepository) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(dependencyInjector: DependencyInjector): boolean {
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(currentOperatingSystem);
    }

    public getSettingsStructure(dependencyInjector: DependencyInjector): ExtensionSettingsStructure {
        const app = dependencyInjector.getInstance<App>("App");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");

        if (operatingSystem === "Windows") {
            return [
                <ExtensionSettingList>{
                    id: "windowsFileExtensions",
                    description: `File extensions, e.g.: "lnk" or "exe"`,
                    defaultValues: ["lnk"],
                },
                <ExtensionSettingList>{
                    id: "windowsFolders",
                    description: "Folders",
                    defaultValues: [
                        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
                        join(app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
                    ],
                },
            ];
        }

        if (operatingSystem === "macOS") {
            return [
                <ExtensionSettingList>{
                    defaultValues: [
                        "/System/Applications",
                        "/System/Library/CoreServices",
                        "/Applications",
                        join(app.getPath("home"), "Applications"),
                    ],
                    description: "Folders",
                    id: "macOsFolders",
                },
            ];
        }

        return [];
    }
}
