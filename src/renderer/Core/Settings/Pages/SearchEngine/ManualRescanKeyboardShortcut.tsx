import { KeyboardShortcut } from "@Core/Components";
import { Setting } from "@Core/Settings/Setting";
import { useTranslation } from "react-i18next";

export const ManualRescanKeyboardShortcut = () => {
    const { t } = useTranslation("settingsSearchEngine");

    return <Setting label={t("keyboardShortcutForManualRescan")} control={<KeyboardShortcut shortcut="F5" />} />;
};
