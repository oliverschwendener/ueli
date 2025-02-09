import { tokens } from "@fluentui/react-components";

export const SearchResultListItemSelectedIndicator = () => {
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: "50%",
                backgroundColor: tokens.colorBrandForeground1,
                height: "45%",
                width: 3,
                transform: "translateY(-50%)",
                borderRadius: tokens.borderRadiusLarge,
            }}
        ></div>
    );
};
