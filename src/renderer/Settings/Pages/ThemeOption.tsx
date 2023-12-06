type ThemeOptionProps = {
    themeName: string;
    accentColor: string;
};

export const ThemeOption = ({ themeName, accentColor }: ThemeOptionProps) => {
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
                    backgroundColor: accentColor,
                    height: 16,
                    width: 16,
                    borderRadius: "50%",
                }}
            ></div>
            {themeName}
        </div>
    );
};
