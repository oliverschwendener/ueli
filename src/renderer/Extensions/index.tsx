import { useExtensionProps } from "@Core/Hooks";
import type { ReactElement } from "react";
import { ApplicationSearchSettings } from "./ApplicationSearch";
import { BrowserBookmarksSettings } from "./BrowserBookmarks";
import { CalculatorSettings } from "./Calculator";
import { CurrencyConversionSettings } from "./CurrencyConversion";
import { DeeplTranslator, DeeplTranslatorSettings } from "./DeeplTranslator";
import { FileSearch, FileSearchSettings } from "./FileSearch";
import { TerminalLauncherSettings } from "./TerminalLauncher";
import { WebSearchExtension } from "./WebSearch";
import { WebSearchSettings } from "./WebSearch/WebSearchSettings";
import { WorkflowSettings } from "./Workflow";
import { EnglishDictionary} from "./EnglishDictionary";

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
        CurrencyConversion: {
            settings: <CurrencyConversionSettings />,
        },
        DeeplTranslator: {
            extension: <DeeplTranslator {...props} />,
            settings: <DeeplTranslatorSettings />,
        },
        FileSearch: {
            extension: <FileSearch {...props} />,
            settings: <FileSearchSettings />,
        },
        TerminalLauncher: {
            settings: <TerminalLauncherSettings />,
        },
        WebSearch: {
            extension: <WebSearchExtension {...props} />,
            settings: <WebSearchSettings />,
        },
        Workflow: {
            settings: <WorkflowSettings />,
        },
        EnglishDictionary: {
            extension: <EnglishDictionary {...props} />,
        }
    };

    return extensions[extensionId];
};
