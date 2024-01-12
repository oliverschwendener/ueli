import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { DeeplTranslatorSettings } from "./DeeplTranslator";

type ExtensionSettingsProps = {
    extensionId: string;
};

export const ExtensionSettings = ({ extensionId }: ExtensionSettingsProps) => {
    const map: Record<string, ReactElement> = {
        ApplicationSearch: <ApplicationSearchSettings />,
        DeeplTranslator: <DeeplTranslatorSettings />,
    };

    return map[extensionId];
};
