import { executeFilePathMacOs, executeFilePathWindows, executeFilePathLinux } from "./file-path-executor";

export function executeMacOSOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathMacOs(executionArgument, false);
}

export function executeWindowsOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathWindows(executionArgument, false);
}

export function executeLinuxOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathLinux(executionArgument, false);
}