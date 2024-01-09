import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";

type ExtensionSettingsProps = {
    extensionId: string;
};

export const ExtensionSettings = ({ extensionId }: ExtensionSettingsProps) => {
    const map: Record<string, ReactElement> = {
        ApplicationSearch: <ApplicationSearchSettings />,
    };

    return map[extensionId];
};
