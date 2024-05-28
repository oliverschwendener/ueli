import { useContextBridge } from "@Core/Hooks";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { ArrowCounterclockwiseRegular } from "@fluentui/react-icons";
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
        <Field
            label={t("rescanIntervalInSeconds", { ns })}
            validationState={tempRescanIntervalInSeconds < 10 ? "error" : "success"}
            validationMessage={tempRescanIntervalInSeconds < 10 ? t("rescanIntervalTooShort", { ns }) : undefined}
        >
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
                    <Tooltip content={t("rescanIntervalResetToDefault", { ns })} relationship="label">
                        <Button
                            size="small"
                            appearance="subtle"
                            icon={<ArrowCounterclockwiseRegular fontSize={14} />}
                            onClick={() => {
                                setTempRescanIntervalInSeconds(defaultRescanIntervalInSeconds);
                                setRescanIntervalInSeconds(defaultRescanIntervalInSeconds);
                            }}
                        />
                    </Tooltip>
                }
            />
        </Field>
    );
};
