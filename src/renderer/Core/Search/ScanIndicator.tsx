import { Spinner } from "@fluentui/react-components";

export const ScanIndicator = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Spinner size="small" />
        </div>
    );
};
