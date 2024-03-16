import { useContextBridge } from "@Core/Hooks";
import type { OperatingSystem } from "@common/Core";
import type { ReactElement } from "react";
import { LinuxSettings } from "./Linux";
import { MacOsSettings } from "./MacOs";
import { WindowsSettings } from "./Windows";

export const ApplicationSearchSettings = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const settings: Record<OperatingSystem, ReactElement> = {
        Linux: <LinuxSettings />,
        macOS: <MacOsSettings />,
        Windows: <WindowsSettings />,
    };

    return settings[operatingSystem];
};
