import type { Resources } from "@common/Core/Translator";

export type WindowsTranslations = {
    extensionName: string;
    shutdown: string;
    restart: string;
    signOut: string;
    lock: string;
    sleep: string;
    hibernate: string;
    searchResultItemDescription: string;
    emptyTrash: string;
};

export const windowsResources: Resources<WindowsTranslations> = {
    "en-US": {
        extensionName: "System Commands",
        shutdown: "Shutdown",
        restart: "Restart",
        signOut: "Sign Out",
        lock: "Lock",
        sleep: "Sleep",
        hibernate: "Hibernate",
        searchResultItemDescription: "System Command",
        emptyTrash: "Empty recycle bin",
    },
    "de-CH": {
        extensionName: "Systembefehle",
        shutdown: "Herunterfahren",
        restart: "Neustarten...",
        signOut: "Abmelden",
        lock: "Sperren",
        sleep: "Energie sparen",
        hibernate: "Schlafen",
        searchResultItemDescription: "Systembefehl",
        emptyTrash: "Paperkorb leeren",
    },
    "ja-JP": {
        extensionName: "システムコマンド",
        shutdown: "シャットダウン",
        restart: "再起動",
        signOut: "サインアウト",
        lock: "画面ロック",
        sleep: "スリープ",
        hibernate: "ハイバネーション",
        searchResultItemDescription: "システムコマンド",
        emptyTrash: "ゴミ箱を空にする",
    },
    "ko-KR": {
        extensionName: "시스템 명령어",
        shutdown: "종료",
        restart: "재시작",
        signOut: "로그아웃",
        lock: "잠금",
        sleep: "절전 모드",
        hibernate: "최대 절전 모드",
        searchResultItemDescription: "시스템 명령어",
        emptyTrash: "휴지통 비우기",
    },
};
