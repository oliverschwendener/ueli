import { useExtensionProps } from "@Core/Hooks";
import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { BrowserBookmarksSettings } from "./BrowserBookmarks";
import { CalculatorSettings } from "./Calculator";
import { DeeplTranslator, DeeplTranslatorSettings } from "./DeeplTranslator";
import { WebSearchExtension } from "./WebSearch";
import { WebSearchSettings } from "./WebSearch/WebSearchSettings";

type ExtensionReactElements = {
    extension?: ReactElement;
    settings?: ReactElement;
};

export const getExtension = (extensionId: string): ExtensionReactElements | undefined => {
    const props = useExtensionProps();

    const extensions: Record<string, ExtensionReactElements> = {
        ApplicationSearch: {
            settings: <ApplicationSearchSettings />,
        },
        BrowserBookmarks: {
            settings: <BrowserBookmarksSettings />,
        },
        Calculator: {
            settings: <CalculatorSettings />,
        },
        DeeplTranslator: {
            extension: <DeeplTranslator {...props} />,
            settings: <DeeplTranslatorSettings />,
        },
        WebSearch: {
            extension: <WebSearchExtension {...props} />,
            settings: <WebSearchSettings />,
        },
    };

    return extensions[extensionId];
};
