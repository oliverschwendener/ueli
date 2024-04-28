import { useContextBridge } from "@Core/Hooks";
import type { OperatingSystem } from "@common/Core";
import type { ReactElement } from "react";
import { MacOsSettings } from "./MacOs";
import { WindowsSettings } from "./Windows";

export const ApplicationSearchSettings = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const settings: Record<OperatingSystem, ReactElement | null> = {
        Linux: null, // There are no settings for Linux at the moment
        macOS: <MacOsSettings />,
        Windows: <WindowsSettings />,
    };

    return settings[operatingSystem];
};
