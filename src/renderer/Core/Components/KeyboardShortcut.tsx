import { ThemeContext } from "@Core/Theme/ThemeContext";
import { useContext } from "react";

type KeyboardShortcutProps = {
    shortcut: string;
};

export const KeyboardShortcut = ({ shortcut }: KeyboardShortcutProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            {shortcut.split("+").map((part) => (
                <kbd
                    key={`keyboard-shortcut-part-${part}`}
                    style={{
                        backgroundColor: theme.colorNeutralBackground5,
                        borderRadius: theme.borderRadiusMedium,
                        padding: "0px 5px",
                    }}
                >
                    {part}
                </kbd>
            ))}
        </div>
    );
};
