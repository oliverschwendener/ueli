import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type RescanIntervalProps = {
    automaticRescanEnabled: boolean;
};

export const RescanInterval = ({ automaticRescanEnabled }: RescanIntervalProps) => {
    const { t } = useTranslation("settingsSearchEngine");

    const defaultRescanIntervalInSeconds = 300;

    const rescanIntervalInSeconds = window.ContextBridge.getSettingValue(
        "searchEngine.rescanIntervalInSeconds",
        defaultRescanIntervalInSeconds,
    );

    const [tempRescanIntervalInSeconds, setTempRescanIntervalInSeconds] = useState<number>(rescanIntervalInSeconds);

    const setRescanIntervalInSeconds = (value: number) =>
        window.ContextBridge.updateSettingValue("searchEngine.rescanIntervalInSeconds", value);

    return (
        <Setting
            label={t("rescanIntervalInSeconds")}
            description={tempRescanIntervalInSeconds < 10 ? t("rescanIntervalTooShort") : undefined}
            control={
                <Input
                    value={`${tempRescanIntervalInSeconds}`}
                    onChange={(_, { value }) => setTempRescanIntervalInSeconds(Number(value))}
                    onBlur={() => {
                        if (tempRescanIntervalInSeconds < 10) {
                            setTempRescanIntervalInSeconds(rescanIntervalInSeconds);
                        } else {
                            setRescanIntervalInSeconds(tempRescanIntervalInSeconds);
                        }
                    }}
                    type="number"
                    disabled={!automaticRescanEnabled}
                    contentAfter={
                        <Tooltip content={t("rescanIntervalResetToDefault")} relationship="label" withArrow>
                            <Button
                                size="small"
                                appearance="subtle"
                                icon={<DismissRegular fontSize={14} />}
                                onClick={() => {
                                    setTempRescanIntervalInSeconds(defaultRescanIntervalInSeconds);
                                    setRescanIntervalInSeconds(defaultRescanIntervalInSeconds);
                                }}
                            />
                        </Tooltip>
                    }
                />
            }
        />
    );
};
