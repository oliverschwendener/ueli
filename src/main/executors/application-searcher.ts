import { normalize } from "path";
import { ApplicationSearchOptions } from "../../common/config/application-search-options";
import { executeCommandWithOutput } from "./command-executor";
import { Logger } from "../../common/logger/logger";
import { OperatingSystemVersion } from "../../common/operating-system";

export function searchWindowsApplications(
    applicationSearchOptions: ApplicationSearchOptions,
    logger: Logger,
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (
            applicationSearchOptions.applicationFolders.length === 0 ||
            applicationSearchOptions.applicationFileExtensions.length === 0
        ) {
            resolve([]);
        }

        const utf8Encoding = "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8";
        const ignoreErrors = "$ErrorActionPreference = 'SilentlyContinue'";
        const createApplicationsArray = "$applications = New-Object Collections.Generic.List[String]";
        const extensions = applicationSearchOptions.applicationFileExtensions.map((e) => `'${e}'`).join(",");
        const createExtensionsHashSet = `$extensions = New-Object System.Collections.Generic.HashSet[string] ([string[]]@(${extensions}), [System.StringComparer]::OrdinalIgnoreCase)`;
        const folders = applicationSearchOptions.applicationFolders
            .map((applicationFolder) => `'${applicationFolder}'`)
            .join(",");
        const getChildItem = `Get-ChildItem -LiteralPath $_ -Recurse -File | Where-Object { $extensions.Contains($_.Extension) } | ForEach-Object { $applications.Add($_.FullName) }`;
        const createResult = `$result = (@{ errors = @($error | ForEach-Object { $_.Exception.Message }); applications = $applications } | ConvertTo-Json)`;
        const printResult = "Write-Host $result";
        const powershellScript = `${utf8Encoding}; ${ignoreErrors}; ${createApplicationsArray}; ${createExtensionsHashSet}; ${folders} | %{ ${getChildItem} }; ${createResult}; ${printResult};`;
        const command = `powershell.exe -NonInteractive -NoProfile -Command "& { ${powershellScript} }"`;
        executeCommandWithOutput(command)
            .then((resultOutput: string) => {
                const result: { errors: string[]; applications: string[] } = JSON.parse(resultOutput);
                if (result.errors && result.errors.length > 0) {
                    logger.error("Errors occurred while searching for applications:\n" + result.errors.join("\n"));
                }
                resolve(result.applications);
            })
            .catch((err) => reject(err));
    });
}

export function searchMacApplications(
    applicationSearchOptions: ApplicationSearchOptions,
    logger: Logger,
    macOsVersion: OperatingSystemVersion,
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0) {
            resolve([]);
        } else {
            executeCommandWithOutput(
                getMacOsApplicationSearcherCommand(macOsVersion, applicationSearchOptions.applicationFolders),
            )
                .then((data) => {
                    const filePaths = data
                        .split("\n")
                        .map((f) => normalize(f).trim())
                        .filter((f) => f.length > 2);

                    resolve(filePaths);
                })
                .catch((err) => reject(err));
        }
    });
}

export function getMacOsApplicationSearcherCommand(macOsVersion: OperatingSystemVersion, folders: string[]): string {
    const folderRegex = folders
        .map((applicationFolder) => `^${applicationFolder.replace("\\", "\\\\").replace("/", "\\/")}`)
        .join("|");

    const foldersAsArgs = folders.map((applicationFolder) => `'${applicationFolder}'`).join(" ");

    switch (macOsVersion) {
        case OperatingSystemVersion.MacOsYosemite:
        case OperatingSystemVersion.MacOsElCapitan:
        case OperatingSystemVersion.MacOsSierra:
        case OperatingSystemVersion.MacOsHighSierra:
        case OperatingSystemVersion.MacOsMojave:
            return `mdfind "kind:apps" | egrep "${folderRegex}"`;
        default:
            /*
             * -type d         # Only directories
             * -iname '*.app'  # Name pattern of application folders
             * -maxdepth 2     # Traverse only 1 level deep to speed up execution
             * -prune          # Do not recursively traverse application folders
             */
            return `find ${foldersAsArgs} -type d -iname '*.app' -maxdepth 2 -prune`;
    }
}
