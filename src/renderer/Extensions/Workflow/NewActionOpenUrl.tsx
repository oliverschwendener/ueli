import type { OpenUrlActionArgs } from "@common/Extensions/Workflow";
import { Field, Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { NewActionTypeProps } from "./NewActionTypeProps";

export const NewActionOpenUrl = ({ args, setArgs }: NewActionTypeProps) => {
    const { t } = useTranslation("extension[Workflow]");

    const { url } = args as OpenUrlActionArgs;

    const setUrl = (url: string) => setArgs({ url });

    return (
        <Field label={t(`argType.OpenUrl`)}>
            <Input
                value={url}
                onChange={(_, { value }) => setUrl(value)}
                placeholder={t(`argType.OpenUrl.placeholder`)}
                size="small"
            />
        </Field>
    );
};
