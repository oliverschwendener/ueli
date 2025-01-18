import { tokens } from "@fluentui/react-components";

type KeyboardShortcutProps = {
    shortcut: string;
};

export const KeyboardShortcut = ({ shortcut }: KeyboardShortcutProps) => {
    shortcut = shortcut.replace("Ctrl", "^");
    shortcut = shortcut.replace("Shift", "⇧");
    shortcut = shortcut.replace("Alt", "⌥");
    shortcut = shortcut.replace("Enter", "↵");
    shortcut = shortcut.replace("Backspace", "⌫");

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, paddingTop: 2 }}>
            {shortcut.split("+").map((part) => (
                <kbd
                    key={`keyboard-shortcut-part-${part}`}
                    style={{
                        backgroundColor: tokens.colorNeutralBackground5,
                        borderRadius: tokens.borderRadiusMedium,
                        padding: "0px 5px",
                        fontSize: tokens.fontSizeBase200,
                    }}
                >
                    {part}
                </kbd>
            ))}
        </div>
    );
};
