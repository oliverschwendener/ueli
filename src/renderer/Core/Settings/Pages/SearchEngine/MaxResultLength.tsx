import { useSetting } from "@Core/Hooks";
import { Field, Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export const MaxResultLength = () => {
    const ns = "settingsSearchEngine";
    const { t } = useTranslation();

    const { value: maxResultLength, updateValue: setMaxResultLength } = useSetting({
        key: "searchEngine.maxResultLength",
        defaultValue: 50,
    });

    return (
        <Field label={t("maxResultLength", { ns })}>
            <Input
                value={`${maxResultLength}`}
                min={1}
                max={9999}
                onChange={(_, { value }) => setMaxResultLength(Number(value))}
                type="number"
            />
        </Field>
    );
};
