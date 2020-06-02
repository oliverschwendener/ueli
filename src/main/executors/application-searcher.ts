import { normalize } from "path";
import { ApplicationSearchOptions } from "../../common/config/application-search-options";
import { executeCommandWithOutput } from "./command-executor";
import { Logger } from "../../common/logger/logger";

export function searchWindowsApplications(applicationSearchOptions: ApplicationSearchOptions, logger: Logger): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0 || applicationSearchOptions.applicationFileExtensions.length === 0) {
            resolve([]);
        }

        const utf8Encoding = "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8";
        const ignoreErrors = "$ErrorActionPreference = 'SilentlyContinue'";
        const createApplicationsArray = "$applications = New-Object Collections.Generic.List[String]"
        const folders = applicationSearchOptions.applicationFolders.map((applicationFolder) => `'${applicationFolder}'`).join(",");
        const extensionFilter = applicationSearchOptions.applicationFileExtensions.map((e) => `*${e}`).join(", ");
        const getChildItem = `Get-ChildItem -Path $_ -include ${extensionFilter} -Recurse -File | % { $applications.Add($_.FullName) }`;
        const createResult = `$result = (@{ errors = @($error | ForEach-Object { $_.Exception.Message }); applications = $applications } | ConvertTo-Json)`;
        const printResult = "Write-Host $result";
        const powershellScript = `${utf8Encoding}; ${ignoreErrors}; ${createApplicationsArray}; ${folders} | %{ ${getChildItem} }; ${createResult}; ${printResult};`;
        const command = `powershell -Command "& { ${powershellScript} }"`;
        executeCommandWithOutput(command)
            .then((resultOutput: string) => {
                const result : { errors: string[], applications: string[] } = JSON.parse(resultOutput);
                if (result.errors && result.errors.length > 0) {
                    logger.error('Errors occurred while searching for applications:\n' + result.errors.join("\n"));
                }
                resolve(result.applications);
            })
            .catch((err) => reject(err));
    });
}

export function searchMacApplications(applicationSearchOptions: ApplicationSearchOptions, logger: Logger): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0) {
            resolve([]);
        } else {
            const folderRegex = applicationSearchOptions.applicationFolders.map((applicationFolder) => {
                return `^${applicationFolder.replace("\\", "\\\\").replace("/", "\\/")}`;
            }).join("|");

            executeCommandWithOutput(`mdfind "kind:apps" | egrep "${folderRegex}"`)
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
