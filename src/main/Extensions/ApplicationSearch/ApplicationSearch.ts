import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { ApplicationRepository } from "./ApplicationRepository";
import type { Settings } from "./Settings";

export class ApplicationSearch implements Extension {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[ApplicationSearch]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly applicationRepository: ApplicationRepository,
        private readonly settings: Settings,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: string) {
        return this.settings.getDefaultValue(key);
    }

    public getSettingKeysTriggeringRescan() {
        return [
            getExtensionSettingKey("ApplicationSearch", "windowsFolders"),
            getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"),
            getExtensionSettingKey("ApplicationSearch", "includeWindowsStoreApps"),
            getExtensionSettingKey("ApplicationSearch", "macOsFolders"),
            getExtensionSettingKey("ApplicationSearch", "mdfindFilterOption"),
        ];
    }

    public getImage(): Image {
        const fileNames: Record<OperatingSystem, { neutral: string }> = {
            Linux: { neutral: "linux-applications.png" },
            macOS: { neutral: "macos-applications.png" },
            Windows: { neutral: "windows-generic-app-icon.png" },
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem].neutral)}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Application Search",
                searchResultItemDescription: "Application",
                openApplication: "Open",
                openApplicationAsAdministrator: "Open as admin",
                copyFilePathToClipboard: "Copy file path to clipboard",
                advanced: "Advanced",

                // Settings
                general: "General",
                folders: "Folders",
                fileExtensions: "File extensions",
                folderDoesNotExist: "Folder does not exist",
                add: "Add",
                remove: "Remove",
                addFolder: "Add folder",
                chooseFolder: "Chooser folder",
                addFileExtension: "Add file extension",
                includeAppsFromWindowsStore: "Include apps from Windows Store",
            },
            "de-CH": {
                extensionName: "Anwendungssuche",
                searchResultItemDescription: "Anwendung",
                openApplication: "Anwendung starten",
                openApplicationAsAdministrator: "Anwendung als Administrator starten",
                copyFilePathToClipboard: "Dateipfad in Zwischenablage kopieren",
                advanced: "Erweitert",

                // Settings
                general: "Allgemein",
                folders: "Ordner",
                fileExtensions: "Dateierweiterungen",
                folderDoesNotExist: "Ordner existiert nicht",
                add: "Hinzufügen",
                remove: "Entfernen",
                addFolder: "Ordner hinzufügen",
                chooseFolder: "Ordner auswählen",
                addFileExtension: "Dateierweiterung hinzufügen",
                includeAppsFromWindowsStore: "Apps aus dem Windows Store einbeziehen",
            },
            "ja-JP": {
                extensionName: "アプリケーション検索",
                searchResultItemDescription: "アプリケーション",
                openApplication: "開く",
                openApplicationAsAdministrator: "管理者で開く",
                copyFilePathToClipboard: "パスをクリップボードにコピー",
                advanced: "詳細",

                // Settings
                general: "一般",
                folders: "フォルダ",
                fileExtensions: "ファイル拡張子",
                folderDoesNotExist: "フォルダが存在しません",
                add: "追加",
                remove: "削除",
                addFolder: "フォルダ追加",
                chooseFolder: "フォルダ選択",
                addFileExtension: "ファイル拡張子を追加",
                includeAppsFromWindowsStore: "Windowsストアアプリを含む",
            },
            "ko-KR": {
                extensionName: "애플리케이션 검색",
                searchResultItemDescription: "애플리케이션",
                openApplication: "열기",
                openApplicationAsAdministrator: "관리자 권한으로 열기",
                copyFilePathToClipboard: "파일 경로를 클립보드에 복사",
                advanced: "고급",
                // Settings
                general: "일반",
                folders: "폴더",
                fileExtensions: "파일 확장자",
                folderDoesNotExist: "폴더가 존재하지 않습니다",
                add: "추가",
                remove: "제거",
                addFolder: "폴더 추가",
                chooseFolder: "폴더 선택",
                addFileExtension: "파일 확장자 추가",
                includeAppsFromWindowsStore: "Windows 스토어 앱 포함",
            },
        };
    }
}
