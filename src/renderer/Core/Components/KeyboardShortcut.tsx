import { ThemeContext } from "@Core/ThemeContext";
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
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: theme.colorNeutralStroke1,
                        borderRadius: theme.borderRadiusSmall,
                        fontFamily: theme.fontFamilyMonospace,
                        padding: "0px 5px",
                    }}
                >
                    {part}
                </kbd>
            ))}
        </div>
    );
};
