import type { RowlyTextEditorSettings } from "./RowlandTextEditorSettings";

export type InvocationArgument = {
    pattern: string;
    inputText: string;
    settings: RowlyTextEditorSettings;
};
