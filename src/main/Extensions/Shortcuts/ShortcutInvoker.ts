export interface ShortcutInvoker {
    invoke(argument: string): Promise<void>;
}
