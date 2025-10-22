import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const WindowHeight = () => {
    const { t } = useTranslation("settingsWindow");

    const defaultWindowHeight = 400;
    const minimumWindowHeight = 62;

    const { value: windowHeight, updateValue: setWindowHeight } = useSetting({
        key: "window.maxHeight",
        defaultValue: defaultWindowHeight,
    });

    const [tempWindowHeight, setTempWindowHeight] = useState<number>(windowHeight);

    const validateTempHeight = (value: number) => {
        setTempWindowHeight(value);

        if (value >= minimumWindowHeight) {
            setWindowHeight(value);
        }
    };

    return (
        <Setting
            label={t("windowHeight")}
            description={tempWindowHeight < minimumWindowHeight ? t("windowHeightTooShort") : undefined}
            control={
                <Input
                    value={`${tempWindowHeight < minimumWindowHeight ? tempWindowHeight : windowHeight}`}
                    onChange={(_, { value }) => validateTempHeight(Number(value))}
                    onBlur={() => {
                        if (tempWindowHeight < minimumWindowHeight) {
                            setTempWindowHeight(tempWindowHeight);
                        }
                    }}
                    type="number"
                    contentAfter={
                        <Tooltip content={t("windowHeightResetToDefault")} relationship="label" withArrow>
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<DismissRegular fontSize={14} />}
                                onClick={() => {
                                    setTempWindowHeight(defaultWindowHeight);
                                    setWindowHeight(defaultWindowHeight);
                                }}
                            />
                        </Tooltip>
                    }
                />
            }
        />
    );
};
