import { OperatingSystemCommand } from "./operating-system-command";
import { IconType } from "../../../common/icon/icon-type";
import { OperatingSystemCommandRepository } from "./operating-system-commands-repository";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";

export class MacOsOperatingSystemCommandRepository implements OperatingSystemCommandRepository {
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
                description: this.translationSet.macOsShutdownDescription,
                executionArgument: `osascript -e \'tell app "System Events" to shut down\'`,
                icon: {
                    parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 14.984375 2.9863281 A 1.0001 1.0001 0 0 0 14 4 L 14 15 A 1.0001 1.0001 0 1 0 16 15 L 16 4 A 1.0001 1.0001 0 0 0 14.984375 2.9863281 z M 9.9960938 4.2128906 A 1.0001 1.0001 0 0 0 9.5449219 4.328125 C 5.6645289 6.3141271 3 10.347825 3 15 C 3 21.615466 8.3845336 27 15 27 C 21.615466 27 27 21.615466 27 15 C 27 10.347825 24.335471 6.3141271 20.455078 4.328125 A 1.0001544 1.0001544 0 1 0 19.544922 6.109375 C 22.780529 7.7653729 25 11.110175 25 15 C 25 20.534534 20.534534 25 15 25 C 9.4654664 25 5 20.534534 5 15 C 5 11.110175 7.2194712 7.7653729 10.455078 6.109375 A 1.0001 1.0001 0 0 0 9.9960938 4.2128906 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"></path>
                    </svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.macOsShutdown,
                searchable: [this.translationSet.macOsShutdown],
            },
            {
                description: this.translationSet.macOsRestartDescription,
                executionArgument: `osascript -e \'tell app "System Events" to restart\'`,
                icon: {
                    parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M 2 2 L 4.9394531 4.9394531 C 3.1262684 6.7482143 2 9.2427079 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 6.486 17.514 2 12 2 L 12 4 C 16.411 4 20 7.589 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 9.7940092 4.9004767 7.7972757 6.3496094 6.3496094 L 9 9 L 9 2 L 2 2 z"></path>
                </svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.macOsRestart,
                searchable: [this.translationSet.macOsRestart],
            },
            {
                description: this.translationSet.macOsLogoutDescription,
                executionArgument: `osascript -e \'tell application "System Events" to log out\'`,
                icon: {
                    parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1">
                    <g id="surface1">
                        <path d="M 6 0 C 4.34375 0 3 1.34375 3 3 L 3 23 C 3 24.65625 4.34375 26 6 26 L 20 26 C 21.65625 26 23 24.65625 23 23 L 23 17.8125 L 21 19.5625 L 21 23 C 21 23.550781 20.550781 24 20 24 L 6 24 C 5.449219 24 5 23.550781 5 23 L 5 3 C 5 2.449219 5.449219 2 6 2 L 20 2 C 20.550781 2 21 2.449219 21 3 L 21 6.4375 L 23 8.1875 L 23 3 C 23 1.34375 21.65625 0 20 0 Z M 16.5 6.46875 C 16.25 6.542969 16 6.796875 16 7.46875 L 16 10 L 10 10 C 9.449219 10 9 10.449219 9 11 L 9 15 C 9 15.550781 9.449219 16 10 16 L 16 16 L 16 18.5 C 16 19.78125 17 19.5 17 19.5 L 24.5 13 L 17 6.5 C 17 6.5 16.75 6.394531 16.5 6.46875 Z "></path>
                    </g>
                </svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.macOsLogout,
                searchable: [this.translationSet.macOsLogout],
            },
            {
                description: this.translationSet.macOsSleepDescription,
                executionArgument: `osascript -e \'tell application "System Events" to sleep\'`,
                icon: {
                    parameter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 5 4 L 5 6 L 13.15625 6 L 5.3125 13.75 L 5 14.0625 L 5 16 L 16 16 L 16 14 L 7.90625 14 L 15.6875 6.3125 L 16 6.03125 L 16 4 Z M 18 10 L 18 12 L 24.15625 12 L 18.3125 17.75 L 18 18.0625 L 18 20 L 27 20 L 27 18 L 20.90625 18 L 26.6875 12.3125 L 27 12.03125 L 27 10 Z M 8 19 L 8 21 L 13.15625 21 L 8.3125 25.75 L 8 26.0625 L 8 28 L 16 28 L 16 26 L 10.90625 26 L 15.6875 21.3125 L 16 21.03125 L 16 19 Z"></path></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.macOsSleep,
                searchable: [this.translationSet.macOsSleep],
            },
            {
                description: this.translationSet.macOsLockDescription,
                executionArgument: `osascript -e \'tell application "System Events" to keystroke "q" using {control down, command down}\'`,
                icon: {
                    parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1"><g id="surface1"><path d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "></path></g></svg>`,
                    type: IconType.SVG,
                },
                name: this.translationSet.macOsLock,
                searchable: [this.translationSet.macOsLock],
            },
        ];
    }
}
