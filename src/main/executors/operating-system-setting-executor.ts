import { executeFilePathMacOs, executeFilePathWindows } from "./file-path-executor";

export function executeMacOSOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathMacOs(executionArgument, false);
}

export function executeWindowsOperatingSystemSetting(executionArgument: string): Promise<void> {
    return executeFilePathWindows(executionArgument, false);
}
