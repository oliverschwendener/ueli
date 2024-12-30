import { tokens } from "@fluentui/react-components";

type KeyboardShortcutProps = {
    shortcut: string;
};

export const KeyboardShortcut = ({ shortcut }: KeyboardShortcutProps) => {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            {shortcut.split("+").map((part) => (
                <kbd
                    key={`keyboard-shortcut-part-${part}`}
                    style={{
                        backgroundColor: tokens.colorNeutralBackground5,
                        borderRadius: tokens.borderRadiusMedium,
                        padding: "0px 5px",
                    }}
                >
                    {part}
                </kbd>
            ))}
        </div>
    );
};
