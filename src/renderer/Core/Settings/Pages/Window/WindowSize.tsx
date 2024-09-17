import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SpinButton } from "@fluentui/react-components";
import type { Size } from "electron/main";
import { useTranslation } from "react-i18next";

export const WindowSize = ({
    lable,
    setting,
    defaultValue,
}: {
    lable: string;
    setting: string;
    defaultValue: Size;
}) => {
    const { t } = useTranslation("settingsWindow");

    const { value: windowSize, updateValue: setWindowSize } = useSetting<Size>({
        key: setting,
        defaultValue: defaultValue,
    });

    return (
        <Setting
            label={t(lable)}
            control={
                <span style={{ display: "flex", gap: 10 }}>
                    <SpinButton
                        min={300}
                        value={windowSize.width}
                        onChange={(_, { value, displayValue }) => {
                            setWindowSize({
                                width: Number(displayValue) || value || 0,
                                height: windowSize.height,
                            });
                        }}
                    />
                    <SpinButton
                        min={200}
                        value={windowSize.height}
                        onChange={(_, { value, displayValue }) => {
                            setWindowSize({
                                width: windowSize.width,
                                height: Number(displayValue) || value || 0,
                            });
                        }}
                    />
                </span>
            }
        />
    );
};
