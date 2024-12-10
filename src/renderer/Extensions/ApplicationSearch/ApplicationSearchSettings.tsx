import type { OperatingSystem } from "@common/Core";
import type { ReactElement } from "react";
import { LinuxSettings } from "./Linux";
import { MacOsSettings } from "./MacOs";
import { WindowsSettings } from "./Windows";

export const ApplicationSearchSettings = () => {
    const settings: Record<OperatingSystem, ReactElement> = {
        Linux: <LinuxSettings />,
        macOS: <MacOsSettings />,
        Windows: <WindowsSettings />,
    };

    return settings[window.ContextBridge.getOperatingSystem()];
};
