import { useContextBridge } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type RescanIntervalProps = {
    automaticRescanEnabled: boolean;
};

export const RescanInterval = ({ automaticRescanEnabled }: RescanIntervalProps) => {
    const ns = "settingsSearchEngine";

    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const defaultRescanIntervalInSeconds = 300;

    const rescanIntervalInSeconds = contextBridge.getSettingValue(
        "searchEngine.rescanIntervalInSeconds",
        defaultRescanIntervalInSeconds,
    );

    const [tempRescanIntervalInSeconds, setTempRescanIntervalInSeconds] = useState<number>(rescanIntervalInSeconds);

    const setRescanIntervalInSeconds = (value: number) =>
        contextBridge.updateSettingValue("searchEngine.rescanIntervalInSeconds", value);

    return (
        <Setting
            label={t("rescanIntervalInSeconds", { ns })}
            description={tempRescanIntervalInSeconds < 10 ? t("rescanIntervalTooShort", { ns }) : undefined}
            control={
                <Input
                    value={`${tempRescanIntervalInSeconds}`}
                    onChange={(_, { value }) => setTempRescanIntervalInSeconds(Number(value))}
                    onBlur={() => {
                        tempRescanIntervalInSeconds < 10
                            ? setTempRescanIntervalInSeconds(rescanIntervalInSeconds)
                            : setRescanIntervalInSeconds(tempRescanIntervalInSeconds);
                    }}
                    type="number"
                    disabled={!automaticRescanEnabled}
                    contentAfter={
                        <Tooltip content={t("rescanIntervalResetToDefault", { ns })} relationship="label" withArrow>
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
