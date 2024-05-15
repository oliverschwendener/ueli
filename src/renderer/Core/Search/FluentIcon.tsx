import type { FluentIcon as FluentIconString } from "@common/Core";
import {
    AppsAddInRegular,
    ArrowSquareUpRightRegular,
    CopyRegular,
    DismissCircleRegular,
    DocumentFolderRegular,
    EyeOffRegular,
    OpenRegular,
    SettingsRegular,
    StarOffRegular,
    StarRegular,
    ToggleMultipleRegular,
    WindowConsoleRegular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";

export const FluentIcon = ({ icon }: { icon: FluentIconString }) => {
    const icons: Record<FluentIconString, ReactElement> = {
        AppsAddInRegular: <AppsAddInRegular />,
        ArrowSquareUpRightRegular: <ArrowSquareUpRightRegular />,
        CopyRegular: <CopyRegular />,
        DismissCircleRegular: <DismissCircleRegular />,
        DocumentFolderRegular: <DocumentFolderRegular />,
        EyeOffRegular: <EyeOffRegular />,
        OpenRegular: <OpenRegular />,
        SettingsRegular: <SettingsRegular />,
        StarOffRegular: <StarOffRegular />,
        StarRegular: <StarRegular />,
        ToggleMultipleRegular: <ToggleMultipleRegular />,
        WindowConsoleRegular: <WindowConsoleRegular />,
    };

    return icons[icon] ?? <>Unknown Icon</>;
};
