import type { FluentIcon as FluentIconString } from "@common/Core";
import {
    AppsAddInRegular,
    ArrowSquareUpRightRegular,
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

export const FluentIcon = ({ icon }: { icon: FluentIconString }) => {
    const icons: Record<FluentIconString, ReactElement> = {
        AppsAddInRegular: <AppsAddInRegular />,
        ArrowSquareUpRightRegular: <ArrowSquareUpRightRegular />,
        CopyRegular: <CopyRegular />,
        DeleteDismissRegular: <DeleteDismissRegular />,
        DismissCircleRegular: <DismissCircleRegular />,
        DocumentFolderRegular: <DocumentFolderRegular />,
        EyeOffRegular: <EyeOffRegular />,
        OpenRegular: <OpenRegular />,
        SettingsRegular: <SettingsRegular />,
        ShieldPersonRegular: <ShieldPersonRegular />,
        StarOffRegular: <StarOffRegular />,
        StarRegular: <StarRegular />,
        ToggleMultipleRegular: <ToggleMultipleRegular />,
        WindowConsoleRegular: <WindowConsoleRegular />,
    };

    return icons[icon] ?? <>Unknown Icon</>;
};
