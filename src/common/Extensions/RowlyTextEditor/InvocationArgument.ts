import type { RowlyTextEditorSettings } from "./RowlyTextEditorSettings";

export type InvocationArgument = {
    pattern: string;
    inputText: string;
    settings: RowlyTextEditorSettings;
};
