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
                executionArgument: ">shutdown -s -t 0",
                tags: ["power", "off"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 15 4 L 15 16 L 17 16 L 17 4 Z M 12 4.6875 C 7.347656 6.339844 4 10.785156 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 10.785156 24.652344 6.339844 20 4.6875 L 20 6.84375 C 23.527344 8.390625 26 11.910156 26 16 C 26 21.515625 21.515625 26 16 26 C 10.484375 26 6 21.515625 6 16 C 6 11.910156 8.472656 8.390625 12 6.84375 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Restart",
                executionArgument: ">shutdown -r -t 0",
                tags: ["reboot"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 16 4 L 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 12.734375 7.585938 9.851563 10 8.03125 L 10 13 L 12 13 L 12 5 L 4 5 L 4 7 L 8.09375 7 C 5.59375 9.199219 4 12.417969 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Sign out",
                executionArgument: ">shutdown /l",
                tags: ["out", "off", "sign", "user"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 5 3 L 5 29 L 23 29 L 23 23.1875 L 21.90625 22.125 L 21.0625 21.25 L 21 21.25 L 21 27 L 7 27 L 7 5 L 21 5 L 21 10.8125 L 21.90625 9.875 L 23 8.8125 L 23 3 Z M 23.34375 11.28125 L 21.90625 12.71875 L 24.1875 15 L 12 15 L 12 17 L 24.1875 17 L 21.90625 19.28125 L 23.34375 20.71875 L 27.34375 16.71875 L 28.03125 16 L 27.34375 15.28125 Z "></path>
                            </g>
                        </svg>`
            },
            <SearchResultItem>{
                name: "Windows Version",
                executionArgument: ">winver",
                tags: ["info", "release", "build"],
                icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                            <g id="surface1">
                                <path d="M 2 5 L 2 23 L 15 23 L 15 25 L 10 25 L 10 27 L 22 27 L 22 25 L 17 25 L 17 23 L 30 23 L 30 5 Z M 4 7 L 28 7 L 28 21 L 4 21 Z M 20 9.84375 L 15.59375 10.46875 L 15.59375 14 L 20 14 Z M 14.59375 10.75 L 11 11.25 L 11 14 L 14.59375 14 Z M 11 15 L 11 17.75 L 14.59375 18.25 L 14.59375 15 Z M 15.59375 15 L 15.59375 18.53125 L 20 19.15625 L 20 15 Z "></path>
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