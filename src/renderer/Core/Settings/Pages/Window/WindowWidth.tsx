import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const WindowWidth = () => {
    const { t } = useTranslation("settingsWindow");

    const defaultWindowWidth = 600;
    const minimumWindowWidth = 300;

    const { value: windowWidth, updateValue: setWindowWidth } = useSetting({
        key: "window.width",
        defaultValue: defaultWindowWidth,
    });

    const [tempWindowWidth, setTempWindowWidth] = useState<number>(windowWidth);

    const validateTempWidth = (value: number) => {
        setTempWindowWidth(value);

        if (value >= minimumWindowWidth) {
            setWindowWidth(value);
        }
    };

    return (
        <Setting
            label={t("windowWidth")}
            description={tempWindowWidth < minimumWindowWidth ? t("windowWidthTooShort") : undefined}
            control={
                <Input
                    value={`${tempWindowWidth < minimumWindowWidth ? tempWindowWidth : windowWidth}`}
                    onChange={(_, { value }) => validateTempWidth(Number(value))}
                    onBlur={() => {
                        if (tempWindowWidth < minimumWindowWidth) {
                            setTempWindowWidth(windowWidth);
                        }
                    }}
                    type="number"
                    contentAfter={
                        <Tooltip content={t("windowWidthResetToDefault")} relationship="label" withArrow>
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<DismissRegular fontSize={14} />}
                                onClick={() => {
                                    setTempWindowWidth(defaultWindowWidth);
                                    setWindowWidth(defaultWindowWidth);
                                }}
                            />
                        </Tooltip>
                    }
                />
            }
        />
    );
};
