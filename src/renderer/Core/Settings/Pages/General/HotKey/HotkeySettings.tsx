import { useSetting } from "@Core/Hooks";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { useTranslation } from "react-i18next";
import { HotKeyBinding } from "./HotkeyBinding";
import { HotkeyEnabled } from "./HotkeyEnabled";

export const HotkeySettings = () => {
    const { t } = useTranslation("settingsGeneral");

    const { value: hotkeyEnabled, updateValue: setHotkeyEnabled } = useSetting({
        key: "general.hotkey.enabled",
        defaultValue: true,
    });

    return (
        <SettingGroup title={t("hotkey")}>
            <HotkeyEnabled hotkeyEnabled={hotkeyEnabled} setHotkeyEnabled={setHotkeyEnabled} />
            <HotKeyBinding hotkeyEnabled={hotkeyEnabled} />
        </SettingGroup>
    );
};
