import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { ProcessKillerOptions } from "../../../common/config/process-killer-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { executeCommandWithOutput, executeCommand } from "../../executors/command-executor";
import Fuse = require("fuse.js");
import { IconType } from "../../../common/icon/icon-type";
import { defaultWindowsAppIcon } from "../../../common/icon/default-icons";

interface Process {
    name: string;
    icon: string;
}

export class ProcessKillerPlugin implements ExecutionPlugin {
    public pluginType = PluginType.ProcessKiller;
    private processes: SearchResultItem[] = [];
    private readonly systemProcesses = ["ntoskrnl", "werfault", "backgroundtaskhost", "backgroundtranferhost", "winlogon", "wininit", "csrss", "lsass", "smss", "services", "taskeng", "taskhost", "dwm", "conhost", "svchost", "sihost"];
    constructor(
        private config: ProcessKillerOptions,
        private translationSet: TranslationSet,
    ) { }

    isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return userInput.startsWith(this.config.prefix);
    }
    getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const command = userInput.replace(this.config.prefix, "");
            if (command === "") {
                executeCommandWithOutput(`powershell -NonInteractive -NoProfile -Command "${getProcessCommand}"`)
                    .then(data => {
                        const processNames = JSON.parse(data)
                            .filter((process: Process) => !this.systemProcesses.includes(process.name.toLowerCase()))
                            .map((process: Process) => {
                                return {
                                    description: this.translationSet.processKillerDescription.replace("{{process}}", process.name),
                                    executionArgument: `powershell -NonInteractive -NoProfile -Command "Stop-Process -Force -Name ${process.name}"`,
                                    hideMainWindowAfterExecution: true,
                                    icon: process.icon !== "" ? {
                                        parameter: `data:image/png;base64,${process.icon}`,
                                        type: IconType.URL,
                                    } : defaultWindowsAppIcon,
                                    name: process.name,
                                    originPluginType: this.pluginType,
                                    searchable: [process.name],
                                };
                            });
                        this.processes = processNames;
                        resolve(processNames);
                    })
                    .catch(error => reject(error));
            } else {
                const fuse = new Fuse(this.processes, {
                    distance: 100,
                    includeScore: true,
                    keys: ["searchable"],
                    location: 0,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    shouldSort: true,
                });
                const fuserResults = fuse.search(userInput) as any[];
                const sorted = fuserResults.sort((a: any, b: any) => a.score - b.score);
                const filtered = sorted.map((item: any): SearchResultItem => item.item);
                resolve(filtered);
            }
        });
    }
    isEnabled(): boolean {
        return this.config.isEnabled;
    }
    execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            executeCommand(`powershell -NonInteractive -NoProfile -Command "${searchResultItem.executionArgument}"`)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }
    updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.commandlineOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}

const getProcessCommand = `
                $ErrorActionPreference = 'SilentlyContinue';
                Add-Type -AssemblyName System.Drawing;

                Function ExtractIcon {
                Param (
                    [Parameter(Mandatory = $true)]
                    [string]$path
                )

                $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($Path);
                $Bitmap = $Icon.ToBitmap();
                $MemoryStream = New-Object System.IO.MemoryStream;
                $Bitmap.save($MemoryStream, [System.Drawing.Imaging.ImageFormat]::Png);
                $Bytes = $MemoryStream.ToArray();
                $MemoryStream.Flush();
                $MemoryStream.Dispose();
                [Convert]::ToBase64String($Bytes)
                }

                [string[]] $processNames = (Get-Process).ProcessName | Select-Object -Unique;
                $processesObjects = @();

                $global:CurrentIcon;
                foreach ($item in $processNames) {
                    $path = (Get-Process -FileVersionInfo -Name $item).FileName | Select-Object -Unique ;

                    if (![string]::IsNullOrEmpty($path)) {
                        if ($path.GetType() -eq [Object[]]) {
                            $path = $path[0];
                        }
                        else {
                            $path = $path;
                        }

                        $CurrentIcon = ExtractIcon -path $path;
                    }
                    else {
                        $CurrentIcon = "";
                    }

                    $processesObjects += [PSCustomObject]@{
                        name = $item;
                        icon = $CurrentIcon;
                    };
                }

                return $processesObjects | ConvertTo-Json;
                `
    .replace(/\n/g, " ")
    .replace(/\"/g, '\\"');