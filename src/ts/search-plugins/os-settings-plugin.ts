import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";
import { Injector } from "../injector";

export class OsSettinsPlugin implements SearchPlugin {
    private items: SearchResultItem[];

    public constructor() {
        this.items = Injector.getOsSettings();
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }
}

export class WindowsSettings {
    private items: SearchResultItem[];

    public constructor() {
        this.items = [
            <SearchResultItem>{
                name: "Shutdown",
                executionArgument: "win:shutdown -s -t 0",
                tags: ["power", "off"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 15 4 L 15 16 L 17 16 L 17 4 Z M 12 4.6875 C 7.347656 6.339844 4 10.785156 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 10.785156 24.652344 6.339844 20 4.6875 L 20 6.84375 C 23.527344 8.390625 26 11.910156 26 16 C 26 21.515625 21.515625 26 16 26 C 10.484375 26 6 21.515625 6 16 C 6 11.910156 8.472656 8.390625 12 6.84375 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Restart",
                executionArgument: "win:shutdown -r -t 0",
                tags: ["reboot"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 16 4 L 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 12.734375 7.585938 9.851563 10 8.03125 L 10 13 L 12 13 L 12 5 L 4 5 L 4 7 L 8.09375 7 C 5.59375 9.199219 4 12.417969 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Sign out",
                executionArgument: "win:shutdown /l",
                tags: ["out", "off", "sign", "user"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 5 3 L 5 29 L 23 29 L 23 23.1875 L 21.90625 22.125 L 21.0625 21.25 L 21 21.25 L 21 27 L 7 27 L 7 5 L 21 5 L 21 10.8125 L 21.90625 9.875 L 23 8.8125 L 23 3 Z M 23.34375 11.28125 L 21.90625 12.71875 L 24.1875 15 L 12 15 L 12 17 L 24.1875 17 L 21.90625 19.28125 L 23.34375 20.71875 L 27.34375 16.71875 L 28.03125 16 L 27.34375 15.28125 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Windows Version",
                executionArgument: "win:winver",
                tags: ["info", "release", "build"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 2 5 L 2 23 L 15 23 L 15 25 L 10 25 L 10 27 L 22 27 L 22 25 L 17 25 L 17 23 L 30 23 L 30 5 Z M 4 7 L 28 7 L 28 21 L 4 21 Z M 20 9.84375 L 15.59375 10.46875 L 15.59375 14 L 20 14 Z M 14.59375 10.75 L 11 11.25 L 11 14 L 14.59375 14 Z M 11 15 L 11 17.75 L 14.59375 18.25 L 14.59375 15 Z M 15.59375 15 L 15.59375 18.53125 L 20 19.15625 L 20 15 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Windows Settings",
                executionArgument: "win:ms-settings:",
                tags: ["system", "preferences", "options"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path style=" " d="M 13.1875 3 L 13.03125 3.8125 L 12.4375 6.78125 C 11.484375 7.15625 10.625 7.683594 9.84375 8.3125 L 6.9375 7.3125 L 6.15625 7.0625 L 5.75 7.78125 L 3.75 11.21875 L 3.34375 11.9375 L 3.9375 12.46875 L 6.1875 14.4375 C 6.105469 14.949219 6 15.460938 6 16 C 6 16.539063 6.105469 17.050781 6.1875 17.5625 L 3.9375 19.53125 L 3.34375 20.0625 L 3.75 20.78125 L 5.75 24.21875 L 6.15625 24.9375 L 6.9375 24.6875 L 9.84375 23.6875 C 10.625 24.316406 11.484375 24.84375 12.4375 25.21875 L 13.03125 28.1875 L 13.1875 29 L 18.8125 29 L 18.96875 28.1875 L 19.5625 25.21875 C 20.515625 24.84375 21.375 24.316406 22.15625 23.6875 L 25.0625 24.6875 L 25.84375 24.9375 L 26.25 24.21875 L 28.25 20.78125 L 28.65625 20.0625 L 28.0625 19.53125 L 25.8125 17.5625 C 25.894531 17.050781 26 16.539063 26 16 C 26 15.460938 25.894531 14.949219 25.8125 14.4375 L 28.0625 12.46875 L 28.65625 11.9375 L 28.25 11.21875 L 26.25 7.78125 L 25.84375 7.0625 L 25.0625 7.3125 L 22.15625 8.3125 C 21.375 7.683594 20.515625 7.15625 19.5625 6.78125 L 18.96875 3.8125 L 18.8125 3 Z M 14.8125 5 L 17.1875 5 L 17.6875 7.59375 L 17.8125 8.1875 L 18.375 8.375 C 19.511719 8.730469 20.542969 9.332031 21.40625 10.125 L 21.84375 10.53125 L 22.40625 10.34375 L 24.9375 9.46875 L 26.125 11.5 L 24.125 13.28125 L 23.65625 13.65625 L 23.8125 14.25 C 23.941406 14.820313 24 15.402344 24 16 C 24 16.597656 23.941406 17.179688 23.8125 17.75 L 23.6875 18.34375 L 24.125 18.71875 L 26.125 20.5 L 24.9375 22.53125 L 22.40625 21.65625 L 21.84375 21.46875 L 21.40625 21.875 C 20.542969 22.667969 19.511719 23.269531 18.375 23.625 L 17.8125 23.8125 L 17.6875 24.40625 L 17.1875 27 L 14.8125 27 L 14.3125 24.40625 L 14.1875 23.8125 L 13.625 23.625 C 12.488281 23.269531 11.457031 22.667969 10.59375 21.875 L 10.15625 21.46875 L 9.59375 21.65625 L 7.0625 22.53125 L 5.875 20.5 L 7.875 18.71875 L 8.34375 18.34375 L 8.1875 17.75 C 8.058594 17.179688 8 16.597656 8 16 C 8 15.402344 8.058594 14.820313 8.1875 14.25 L 8.34375 13.65625 L 7.875 13.28125 L 5.875 11.5 L 7.0625 9.46875 L 9.59375 10.34375 L 10.15625 10.53125 L 10.59375 10.125 C 11.457031 9.332031 12.488281 8.730469 13.625 8.375 L 14.1875 8.1875 L 14.3125 7.59375 Z M 16 11 C 13.25 11 11 13.25 11 16 C 11 18.75 13.25 21 16 21 C 18.75 21 21 18.75 21 16 C 21 13.25 18.75 11 16 11 Z M 16 13 C 17.667969 13 19 14.332031 19 16 C 19 17.667969 17.667969 19 16 19 C 14.332031 19 13 17.667969 13 16 C 13 14.332031 14.332031 13 16 13 Z "></path>
                            </g>
                        </svg>`
            }
        ];
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }
}

export class MacOsSettings {
    private items: SearchResultItem[];

    public constructor() {
        this.items = [];
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }
}