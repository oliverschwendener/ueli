import type { ExecuteCommandActionArgs } from "@common/Extensions/Workflow";
import { Field, Input } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { NewActionTypeProps } from "./NewActionTypeProps";

export const NewActionExecuteCommand = ({ args, setArgs }: NewActionTypeProps) => {
    const { t } = useTranslation("extension[Workflow]");

    const { command } = args as ExecuteCommandActionArgs;

    const setCommand = (command: string) => setArgs({ command });

    return (
        <Field label={t(`argType.ExecuteCommand`)}>
            <Input
                value={command}
                onChange={(_, { value }) => setCommand(value)}
                placeholder={t(`argType.ExecuteCommand.placeholder`)}
                size="small"
            />
        </Field>
    );
};
