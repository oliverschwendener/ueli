import { useExtensionProps } from "@Core/Hooks";
import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { BrowserBookmarksSettings } from "./BrowserBookmarks";
import { DeeplTranslator, DeeplTranslatorSettings } from "./DeeplTranslator";

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
        DeeplTranslator: {
            extension: <DeeplTranslator {...props} />,
            settings: <DeeplTranslatorSettings />,
        },
    };

    return extensions[extensionId];
};
