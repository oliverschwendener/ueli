import { useSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { Input } from "@fluentui/react-components";
import { useEffect, useState } from "react";

type Props = {
    settingKey: string;
    label: string;
    defaultValue: number;
    minimum: number;
    disabled: boolean;
};

export const StartupWindowDimension = ({ settingKey, label, defaultValue, minimum, disabled }: Props) => {
    const { value, updateValue } = useSetting({ key: settingKey, defaultValue });

    // The text being typed is kept separately and only saved on commit, so the window isn't resized on every keystroke.
    const [draft, setDraft] = useState(`${value}`);

    useEffect(() => setDraft(`${value}`), [value]);

    const commit = () => {
        const parsed = Number(draft);

        if (!Number.isInteger(parsed) || parsed < minimum) {
            setDraft(`${value}`);
        } else if (parsed !== value) {
            updateValue(parsed);
        }
    };

    return (
        <Setting
            label={label}
            control={
                <Input
                    type="number"
                    value={draft}
                    min={minimum}
                    disabled={disabled}
                    onChange={(_, { value }) => setDraft(value)}
                    onBlur={commit}
                    onKeyDown={(event) => event.key === "Enter" && commit()}
                />
            }
        />
    );
};
