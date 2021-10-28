import { normalize, extname } from "path";
import { ApplicationSearchOptions } from "../../common/config/application-search-options";
import { executeCommandWithOutput } from "./command-executor";
import { Logger } from "../../common/logger/logger";
import { OperatingSystemVersion } from "../../common/operating-system";
import { FileHelpers } from "../../common/helpers/file-helpers";
import { parse } from "ini";


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
            const folderRegex = applicationSearchOptions.applicationFolders
                .map((applicationFolder) => {
                    return `^${applicationFolder.replace("\\", "\\\\").replace("/", "\\/")}`;
                })
                .join("|");

            executeCommandWithOutput(`${getMacOsApplicationSearcherCommand(macOsVersion)} | egrep "${folderRegex}"`)
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

export function searchLinuxApplications(
    applicationSearchOptions: ApplicationSearchOptions,
    logger: Logger,
    operatingSystemVersion: OperatingSystemVersion,
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0) {
            resolve([]);
        } else {
            const appFilePromises = applicationSearchOptions.applicationFolders
                .map(folder => FileHelpers.readFilesFromFolder(folder))
            Promise.all(appFilePromises)
                .then((applicationFilePaths) => {
                    // This is maybe a bad way to do things
                    const desktopEnv = process.env["XDG_CURRENT_DESKTOP"] || "GNOME";
                    const desktopAppFiles = applicationFilePaths
                        .flat()
                        .filter((f) => applicationSearchOptions.applicationFileExtensions.includes(extname(f)));

                    // Checks if app is supposed to be shown
                    const filterMapPromises = desktopAppFiles.map((f) => {
                        return FileHelpers.readFile(f)
                            .then((data) => {
                                const config = parse(data)["Desktop Entry"];
                                if (!config) return false;
                                // Following X11 specifications (I think)
                                // ini parsing is broken due to Linux's use of semi-colons for lists
                                return (!config.NoDisplay &&
                                    (config.OnlyShowIn !== undefined ? config.OnlyShowIn.split(';').includes(desktopEnv) : true) &&
                                    (config.NotShowIn !== undefined ? config.NotShowIn.split(';').includes(desktopEnv) : true)
                                );
                            });
                    });
                    Promise.all(filterMapPromises)
                        .then(filterMap => {
                            resolve(desktopAppFiles.filter((_value, index) => filterMap[index]));
                        });
                })
                .catch((err) => reject(err));
        }
    });
}

export function getMacOsApplicationSearcherCommand(macOsVersion: OperatingSystemVersion): string {
    switch (macOsVersion) {
        case OperatingSystemVersion.MacOsYosemite:
        case OperatingSystemVersion.MacOsElCapitan:
        case OperatingSystemVersion.MacOsSierra:
        case OperatingSystemVersion.MacOsHighSierra:
        case OperatingSystemVersion.MacOsMojave:
            return `mdfind "kind:apps"`;
        default:
            return "mdfind kMDItemContentTypeTree=com.apple.application-bundle";
    }
}
