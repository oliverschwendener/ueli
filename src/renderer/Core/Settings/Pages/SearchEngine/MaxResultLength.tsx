import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const MaxResultLength = () => {
    const { t } = useTranslation("settingsSearchEngine");

    const { value: maxResultLength, updateValue: setMaxResultLength } = useSetting({
        key: "searchEngine.maxResultLength",
        defaultValue: 50,
    });

    return (
        <Setting
            label={t("maxResultLength")}
            control={
                <Input
                    value={`${maxResultLength}`}
                    min={1}
                    max={9999}
                    onChange={(_, { value }) => setMaxResultLength(Number(value))}
                    type="number"
                />
            }
        />
    );
};
