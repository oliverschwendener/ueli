export type ContextBridge = {
    onNativeThemeChanged: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    settingsOpenStateChanged: (data: { settingsOpened: boolean }) => void;
};
