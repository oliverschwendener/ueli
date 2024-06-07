import { Field, Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type NewActionNameProps = {
    name: string;
    setName: (name: string) => void;
};

export const NewActionName = ({ name, setName }: NewActionNameProps) => {
    const { t } = useTranslation("extension[Workflow]");

    return (
        <Field label={t("actionName")}>
            <Input
                value={name}
                onChange={(_, { value }) => setName(value)}
                placeholder={t("actionNamePlaceholder")}
                size="small"
            />
        </Field>
    );
};
