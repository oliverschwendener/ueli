import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";

export class MacOsSettingsPlugin implements SearchPlugin {
    private items: SearchResultItem[];

    constructor() {
        this.items = [
            {
                executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell app "System Events" to shut down\'`,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                            <g id="surface1">
                                <path d="M 24.984375 1.984375 C 24.433594 1.996094 23.992188 2.449219 24 3 L 24 25 C 23.996094 25.359375 24.183594 25.695313 24.496094 25.878906 C 24.808594 26.058594 25.191406 26.058594 25.503906 25.878906 C 25.816406 25.695313 26.003906 25.359375 26 25 L 26 3 C 26.003906 2.730469 25.898438 2.46875 25.707031 2.277344 C 25.515625 2.085938 25.253906 1.980469 24.984375 1.984375 Z M 18.046875 3.140625 C 17.921875 3.136719 17.796875 3.15625 17.683594 3.195313 C 8.566406 6.253906 2 14.867188 2 25 C 2 37.691406 12.308594 48 25 48 C 37.691406 48 48 37.691406 48 25 C 48 14.867188 41.433594 6.253906 32.316406 3.195313 C 31.792969 3.019531 31.226563 3.300781 31.050781 3.824219 C 30.875 4.347656 31.15625 4.914063 31.683594 5.09375 C 40 7.882813 46 15.730469 46 25 C 46 36.609375 36.609375 46 25 46 C 13.390625 46 4 36.609375 4 25 C 4 15.730469 10 7.882813 18.316406 5.09375 C 18.78125 4.941406 19.070313 4.484375 19 4 C 18.933594 3.519531 18.53125 3.15625 18.046875 3.140625 Z "></path>
                            </g>
                        </svg>`,
                name: "Shutdown",
                tags: ["power", "off"],
            },
            {
                executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell application "System Events" to log out\'`,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                            <g id="surface1">
                                <path d="M 3 0 C 1.355469 0 0 1.355469 0 3 L 0 47 C 0 48.644531 1.355469 50 3 50 L 37 50 C 38.644531 50 40 48.644531 40 47 L 40 39 L 38 41 L 38 47 C 38 47.5625 37.5625 48 37 48 L 3 48 C 2.4375 48 2 47.5625 2 47 L 2 3 C 2 2.433594 2.433594 2 3 2 L 37 2 C 37.5625 2 38 2.4375 38 3 L 38 9 L 40 11 L 40 3 C 40 1.355469 38.644531 0 37 0 Z M 37.84375 13.09375 C 37.46875 13.160156 37.167969 13.433594 37.0625 13.796875 C 36.957031 14.164063 37.066406 14.554688 37.34375 14.8125 L 46.53125 24 L 17 24 C 16.96875 24 16.9375 24 16.90625 24 C 16.355469 24.027344 15.925781 24.496094 15.953125 25.046875 C 15.980469 25.597656 16.449219 26.027344 17 26 L 46.53125 26 L 37.34375 35.1875 C 37.046875 35.429688 36.910156 35.816406 36.996094 36.191406 C 37.082031 36.5625 37.375 36.855469 37.746094 36.941406 C 38.121094 37.027344 38.507813 36.890625 38.75 36.59375 L 49.65625 25.71875 L 50.34375 25 L 49.65625 24.28125 L 38.75 13.40625 C 38.542969 13.183594 38.242188 13.070313 37.9375 13.09375 C 37.90625 13.09375 37.875 13.09375 37.84375 13.09375 Z "></path>
                            </g>
                        </svg>`,
                name: "Log out",
                tags: ["sign", "off"],
            },
            {
                executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}osascript -e \'tell app "System Events" to restart\'`,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 25 2 A 1.0001 1.0001 0 1 0 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 18.307314 7.130711 12.364806 12 8.5195312 L 12 15 A 1.0001 1.0001 0 1 0 14 15 L 14 6.5507812 L 14 5 L 4 5 A 1.0001 1.0001 0 1 0 4 7 L 10.699219 7 C 5.4020866 11.214814 2 17.712204 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"></path>
                        </svg>`,
                name: "Restart",
                tags: ["reboot"],
            },
            {
                executionArgument: `${MacOsSettingsHelpers.macOsSettingsPrefix}/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend'`,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                            <g id="surface1">
                                <path d="M 25 3 C 18.363281 3 13 8.363281 13 15 L 13 20 L 9 20 C 7.355469 20 6 21.355469 6 23 L 6 47 C 6 48.644531 7.355469 50 9 50 L 41 50 C 42.644531 50 44 48.644531 44 47 L 44 23 C 44 21.355469 42.644531 20 41 20 L 37 20 L 37 15 C 37 8.363281 31.636719 3 25 3 Z M 25 5 C 30.566406 5 35 9.433594 35 15 L 35 20 L 15 20 L 15 15 C 15 9.433594 19.433594 5 25 5 Z M 9 22 L 41 22 C 41.554688 22 42 22.445313 42 23 L 42 47 C 42 47.554688 41.554688 48 41 48 L 9 48 C 8.445313 48 8 47.554688 8 47 L 8 23 C 8 22.445313 8.445313 22 9 22 Z M 25 30 C 23.300781 30 22 31.300781 22 33 C 22 33.898438 22.398438 34.6875 23 35.1875 L 23 38 C 23 39.101563 23.898438 40 25 40 C 26.101563 40 27 39.101563 27 38 L 27 35.1875 C 27.601563 34.6875 28 33.898438 28 33 C 28 31.300781 26.699219 30 25 30 Z "></path>
                            </g>
                        </svg>`,
                name: "Lock",
                tags: [],
            },
        ];
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }
}
