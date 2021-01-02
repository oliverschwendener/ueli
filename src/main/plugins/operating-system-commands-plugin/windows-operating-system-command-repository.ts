import { OperatingSystemCommandRepository } from "./operating-system-commands-repository";
import { OperatingSystemCommand } from "./operating-system-command";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { IconType } from "../../../common/icon/icon-type";

export class WindowsOperatingSystemCommandRepository implements OperatingSystemCommandRepository {
    private translationSet: TranslationSet;

    constructor(translationSet: TranslationSet) {
        this.translationSet = translationSet;
    }

    public getAll(): Promise<OperatingSystemCommand[]> {
        return new Promise((resolve, reject) => {
            resolve(this.getOperatingSystemCommands());
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.translationSet = translationSet;
            resolve();
        });
    }

    private getOperatingSystemCommands(): OperatingSystemCommand[] {
        return [
            {
                description: this.translationSet.windowsShutdownDescription,
                executionArgument: `shutdown -s -t 0`,
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m15 4v12h2v-12zm-3 .7c-4.7 1.7-8 6.1-8 11.3 0 6.6 5.4 12 12 12s12-5.4 12-12c0-5.2-3.3-9.6-8-11.3v2.1c3.5 1.6 6 5.1 6 9.2 0 5.5-4.5 10-10 10s-10-4.5-10-10c0-4.1 2.5-7.6 6-9.1z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsShutdown,
                searchable: [this.translationSet.windowsShutdown],
            },
            {
                description: this.translationSet.windowsRestartDescription,
                executionArgument: `shutdown -r -t 0`,
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 4c-4.1 0-7.8 2.1-10 5.4v-2.5h-2v6.4h6v-2h-2.8c1.7-3.2 5-5.3 8.8-5.3 5.5 0 10 4.5 10 10s-4.5 10-10 10c-4.6 0-8.6-3.2-9.7-7.6l-1.9.5c1.3 5.3 6.1 9.1 11.6 9.1 6.6 0 12-5.4 12-12s-5.4-12-12-12z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsRestart,
                searchable: [this.translationSet.windowsRestart],
            },
            {
                description: this.translationSet.windowsSignoutDescription,
                executionArgument: `shutdown /l`,
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m4 4v24h14v-2h-12v-20h12v-2zm18 6-1.5 1.3 3.6 3.7h-13.1v2h13.1l-3.6 3.7 1.5 1.3 6-6z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsSignout,
                searchable: [this.translationSet.windowsSignout],
            },
            {
                description: this.translationSet.windowsLockDescription,
                executionArgument: `rundll32 user32.dll,LockWorkStation`,
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 3c-3.8 0-7 3.2-7 7v3h-3v16h20v-16h-3v-3c0-3.8-3.2-7-7-7zm0 2c2.8 0 5 2.2 5 5v3h-10v-3c0-2.8 2.2-5 5-5zm-8 10h16v12h-16z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsLock,
                searchable: [this.translationSet.windowsLock],
            },
            {
                description: this.translationSet.windowsSleepDescription,
                executionArgument: `powershell -NonInteractive -NoProfile -C "$m='[DllImport(\\\"Powrprof.dll\\\",SetLastError=true)]static extern bool SetSuspendState(bool hibernate,bool forceCritical,bool disableWakeEvent);public static void PowerSleep(){SetSuspendState(false,false,false); }';add-type -name Import -member $m -namespace Dll; [Dll.Import]::PowerSleep();"`,
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m5 4v2h8.2l-8.2 8v2h11v-2h-8.1l8.1-8v-2zm13 6v2h6.2l-6.2 6v2h9v-2h-6.1l6.1-6v-2zm-10 9v2h5.2l-5.2 5v2h8v-2h-5.1l5.1-5v-2z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsSleep,
                searchable: [this.translationSet.windowsSleep],
            },
            {
                description: this.translationSet.windowsHibernationDescription,
                executionArgument: "shutdown /h",
                icon: {
                    parameter: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m5 5v22h22v-22zm2 2h18v18h-18zm6 4v10h2v-10zm4 0v10h2v-10z"/></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.windowsHibernation,
                searchable: [this.translationSet.windowsHibernation],
            },
        ];
    }
}
