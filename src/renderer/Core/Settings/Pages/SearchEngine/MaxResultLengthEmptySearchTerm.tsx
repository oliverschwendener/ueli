import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const MaxResultLengthEmptySearchTerm = () => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    const { value: maxResultLengthEmptySearchTerm, updateValue: setMaxResultLengthEmptySearchTerm } = useSetting({
        key: "searchEngine.maxResultLengthEmptySearchTerm",
        defaultValue: 50,
    });

    return (
        <Setting
            label={t("maxResultLengthEmptySearchTerm", { ns })}
            control={
                <Input
                    value={`${maxResultLengthEmptySearchTerm}`}
                    min={0}
                    max={9999}
                    onChange={(_, { value }) => setMaxResultLengthEmptySearchTerm(Number(value))}
                    type="number"
                />
            }
        />
    );
};
