import { Setting } from "@Core/Settings/Setting";
import { Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type HotkeyEnabledProps = {
    hotkeyEnabled: boolean;
    setHotkeyEnabled: (value: boolean) => void;
};

export const HotkeyEnabled = ({ hotkeyEnabled, setHotkeyEnabled }: HotkeyEnabledProps) => {
    const { t } = useTranslation("settingsGeneral");

    return (
        <Setting
            label={t("hotkeyEnabled")}
            control={<Switch checked={hotkeyEnabled} onChange={(_, { checked }) => setHotkeyEnabled(checked)} />}
        />
    );
};
