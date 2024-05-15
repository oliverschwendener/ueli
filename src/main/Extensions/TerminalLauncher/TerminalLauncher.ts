export interface TerminalLauncher {
    terminalId: string;
    launchWithCommand(command: string): Promise<void>;
}
