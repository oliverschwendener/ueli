import { useExtensionProps } from "@Core/Hooks";
import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { Base64Conversion } from "./Base64Conversion";
import { BrowserBookmarksSettings } from "./BrowserBookmarks";
import { CalculatorSettings } from "./Calculator";
import { ColorConverterSettings } from "./ColorConverter";
import { CurrencyConversionSettings } from "./CurrencyConversion";
import { CustomWebSearchSettings } from "./CustomWebSearch";
import { DeeplTranslator, DeeplTranslatorSettings } from "./DeeplTranslator";
import { FileSearch, FileSearchSettings } from "./FileSearch";
import { SimpleFileSearchSettings } from "./SimpleFileSearch";
import { TerminalLauncherSettings } from "./TerminalLauncher";
import { UuidGenerator, UuidGeneratorSettings } from "./UuidGenerator";
import { VSCodeSettings } from "./VSCode";
import { WebSearchExtension } from "./WebSearch";
import { WebSearchSettings } from "./WebSearch/WebSearchSettings";
import { WorkflowSettings } from "./Workflow";

type ExtensionReactElements = {
    extension?: ReactElement;
    settings?: ReactElement;
};

export const getExtension = (extensionId: string): ExtensionReactElements | undefined => {
    const props = useExtensionProps();

    /**
     * Add your extension to this list. Make sure that the items in this list are alphabetically ordered.
     */
    /*eslint sort-keys: "error"*/
    const extensions: Record<string, ExtensionReactElements> = {
        ApplicationSearch: {
            settings: <ApplicationSearchSettings />,
        },
        Base64Conversion: {
            extension: <Base64Conversion {...props} />,
        },
        BrowserBookmarks: {
            settings: <BrowserBookmarksSettings />,
        },
        Calculator: {
            settings: <CalculatorSettings />,
        },
        ColorConverter: {
            settings: <ColorConverterSettings />,
        },
        CurrencyConversion: {
            settings: <CurrencyConversionSettings />,
        },
        CustomWebSearch: {
            settings: <CustomWebSearchSettings />,
        },
        DeeplTranslator: {
            extension: <DeeplTranslator {...props} />,
            settings: <DeeplTranslatorSettings />,
        },
        FileSearch: {
            extension: <FileSearch {...props} />,
            settings: <FileSearchSettings />,
        },
        SimpleFileSearch: {
            settings: <SimpleFileSearchSettings />,
        },
        TerminalLauncher: {
            settings: <TerminalLauncherSettings />,
        },
        UuidGenerator: {
            extension: <UuidGenerator {...props} />,
            settings: <UuidGeneratorSettings />,
        },
        VSCode: {
            settings: <VSCodeSettings />,
        },
        WebSearch: {
            extension: <WebSearchExtension {...props} />,
            settings: <WebSearchSettings />,
        },
        Workflow: {
            settings: <WorkflowSettings />,
        },
    };

    return extensions[extensionId];
};
