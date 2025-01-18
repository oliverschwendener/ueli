import type { FluentIcon as FluentIconString } from "@common/Core";
import {
    AppsAddInRegular,
    ArrowClockwiseRegular,
    ArrowSquareUpRightRegular,
    CheckmarkCircleRegular,
    CopyRegular,
    DeleteDismissRegular,
    DismissCircleRegular,
    DocumentFolderRegular,
    EyeOffRegular,
    OpenRegular,
    SettingsRegular,
    ShieldPersonRegular,
    StarOffRegular,
    StarRegular,
    ToggleMultipleRegular,
    WindowConsoleRegular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";

export const FluentIcon = ({ icon, fontSize }: { fontSize?: number; icon: FluentIconString }) => {
    const icons: Record<FluentIconString, ReactElement> = {
        AppsAddInRegular: <AppsAddInRegular fontSize={fontSize} />,
        ArrowClockwiseRegular: <ArrowClockwiseRegular fontSize={fontSize} />,
        ArrowSquareUpRightRegular: <ArrowSquareUpRightRegular fontSize={fontSize} />,
        CheckmarkCircleRegular: <CheckmarkCircleRegular fontSize={fontSize} />,
        CopyRegular: <CopyRegular fontSize={fontSize} />,
        DeleteDismissRegular: <DeleteDismissRegular fontSize={fontSize} />,
        DismissCircleRegular: <DismissCircleRegular fontSize={fontSize} />,
        DocumentFolderRegular: <DocumentFolderRegular fontSize={fontSize} />,
        EyeOffRegular: <EyeOffRegular fontSize={fontSize} />,
        OpenRegular: <OpenRegular fontSize={fontSize} />,
        SettingsRegular: <SettingsRegular fontSize={fontSize} />,
        ShieldPersonRegular: <ShieldPersonRegular fontSize={fontSize} />,
        StarOffRegular: <StarOffRegular fontSize={fontSize} />,
        StarRegular: <StarRegular fontSize={fontSize} />,
        ToggleMultipleRegular: <ToggleMultipleRegular fontSize={fontSize} />,
        WindowConsoleRegular: <WindowConsoleRegular fontSize={fontSize} />,
    };

    return icons[icon] ?? <>Unknown Icon</>;
};
