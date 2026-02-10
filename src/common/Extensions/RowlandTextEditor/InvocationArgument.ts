import type { RowlandTextEditorSettings } from "./RowlandTextEditorSettings";

export type InvocationArgument = {
    pattern: string;
    inputText: string;
    settings: RowlandTextEditorSettings;
};
