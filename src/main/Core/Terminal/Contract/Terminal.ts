export interface Terminal {
    terminalId: string;
    isEnabledByDefault?: boolean;
    getTerminalName(): string;
    getAssetFileName(): string;
    launchWithCommand(command: string): Promise<void>;
}
