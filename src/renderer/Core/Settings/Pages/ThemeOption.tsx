type ThemeOptionProps = {
    themeName: string;
    accentColors: {
        light: string;
        dark: string;
    };
};

export const ThemeOption = ({ themeName, accentColors }: ThemeOptionProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
            }}
        >
            <div
                style={{
                    background: `linear-gradient(320deg, ${accentColors.light} 0%, ${accentColors.dark} 100%)`,
                    height: 16,
                    width: 16,
                    borderRadius: "50%",
                }}
            ></div>
            {themeName}
        </div>
    );
};
