import { useContextBridge } from "@Core/Hooks";
import type { OperatingSystem } from "@common/Core";
import type { ReactElement } from "react";
import { MacOsSettings } from "./MacOs";
import { WindowsSettings } from "./Windows";

export const ApplicationSearchSettings = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const settings: Record<OperatingSystem, ReactElement> = {
        Linux: <>NOT SUPPORTED</>,
        macOS: <MacOsSettings />,
        Windows: <WindowsSettings />,
    };

    return settings[operatingSystem];
};
