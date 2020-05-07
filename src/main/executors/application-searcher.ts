import { normalize } from "path";
import { ApplicationSearchOptions } from "../../common/config/application-search-options";
import { executeCommandWithOutput } from "./command-executor";

export function searchWindowsApplications(applicationSearchOptions: ApplicationSearchOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0 || applicationSearchOptions.applicationFileExtensions.length === 0) {
            resolve([]);
        }

        const utf8Encoding = "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8";
        const extensionFilter = applicationSearchOptions.applicationFileExtensions.map((e) => `*${e}`).join(", ");
        const getChildItem = `${utf8Encoding}; Get-ChildItem -Path $_ -include ${extensionFilter} -Recurse -File | % { $_.FullName }`;
        const folders = applicationSearchOptions.applicationFolders.map((applicationFolder) => `'${applicationFolder}'`).join(",");
        const powershellScript = `${folders} | %{ ${getChildItem} }`;

        executeCommandWithOutput(`powershell -Command "& { ${powershellScript} }"`)
            .then((data) => {
                const filePaths = data
                    .split("\n")
                    .map((f) => normalize(f).trim())
                    .filter((f) => f.length > 1);

                resolve(filePaths);
            })
            .catch((err) => reject(err));
    });
}

export function searchMacApplications(applicationSearchOptions: ApplicationSearchOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (applicationSearchOptions.applicationFolders.length === 0) {
            resolve([]);
        } else {
            const folderRegex = applicationSearchOptions.applicationFolders.map((applicationFolder) => {
                return `^${applicationFolder.replace("\\", "\\\\").replace("/", "\\/")}`;
            }).join("|");

            executeCommandWithOutput(`mdfind kMDItemContentTypeTree=com.apple.application-bundle | egrep "${folderRegex}"`)
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
