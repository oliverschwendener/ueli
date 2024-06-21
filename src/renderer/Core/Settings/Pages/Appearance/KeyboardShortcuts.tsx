import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const KeyboardShortcuts = () => {
    const { t } = useTranslation("settingsAppearance");

    const { value: showKeyboardShortcuts, updateValue: setShowKeyboardShortcuts } = useSetting<boolean>({
        key: "appearance.showKeyboardShortcuts",
        defaultValue: true,
    });

    return (
        <SettingGroup title={t("keyboardShortcuts")}>
            <Setting
                label={t("keyboardShortcutsShow")}
                control={
                    <Switch
                        checked={showKeyboardShortcuts}
                        onChange={(_, { checked }) => setShowKeyboardShortcuts(checked)}
                    />
                }
            />
        </SettingGroup>
    );
};
