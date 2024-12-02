import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { SystemCommandRepository } from "./SystemCommandRepository";

export class SystemCommands implements Extension {
    public readonly id = "SystemCommands";

    public readonly name = "System Commands";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[SystemCommands]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly systemCommandRepository: SystemCommandRepository,
        private readonly resources: Resources<Translations>,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return (await this.systemCommandRepository.getAll()).map((s) => s.toSearchResultItem());
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public getImage(): Image {
        const filenames: Record<OperatingSystem, string> = {
            Linux: "linux.png",
            macOS: "macos-system-command.png",
            Windows: "windows-11-system-command.png",
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, filenames[this.operatingSystem])}`,
        };
    }

    public getI18nResources() {
        return this.resources;
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return ["general.language"];
    }
}
