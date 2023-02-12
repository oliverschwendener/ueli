export interface NotesOptions {
    isEnabled: boolean;
    prefixWrite: string;
    prefixRead: string;
}

export const defaultNotesOptions: NotesOptions = {
    isEnabled: true,
    prefixWrite: "note:",
    prefixRead: "notes?",
};
