export interface AutostartManager {
    setAutostartOptions(openAtLogin: boolean): void;
    autostartIsEnabled(): boolean;
}
