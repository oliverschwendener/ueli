import type { Resources } from "@common/Core/Translator";

export type LinuxTranslations = {
    extensionName: string;
    searchResultItemDescription: string;
    emptyTrash: string;
};

export const linuxResources: Resources<LinuxTranslations> = {
    "en-US": {
        extensionName: "System Commands",
        searchResultItemDescription: "System Command",
        emptyTrash: "Empty recycle bin",
    },
    "de-CH": {
        extensionName: "Systembefehle",
        searchResultItemDescription: "Systembefehl",
        emptyTrash: "Papierkorb leeren",
    },
    "ja-JP": {
        extensionName: "システムコマンド",
        searchResultItemDescription: "システムコマンド",
        emptyTrash: "ゴミ箱を空にする",
    },
    "ko-KR": {
        extensionName: "시스템 명령어",
        searchResultItemDescription: "시스템 명령어",
        emptyTrash: "휴지통 비우기",
    },
};
