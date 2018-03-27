import { IconManager } from "./icon-manager";

export class WindowsIconManager implements IconManager {
    public getFolderIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 5 3 L 5 27.8125 L 5.78125 27.96875 L 17.78125 30.46875 L 19 30.71875 L 19 28 L 25 28 L 25 15.4375 L 26.71875 13.71875 L 27 13.40625 L 27 3 Z M 14.125 5 L 25 5 L 25 12.5625 L 23.28125 14.28125 L 23 14.59375 L 23 26 L 19 26 L 19 17.09375 L 18.71875 16.78125 L 17 15.0625 L 17 5.71875 Z M 7 5.28125 L 15 7.28125 L 15 15.90625 L 15.28125 16.21875 L 17 17.9375 L 17 28.28125 L 7 26.1875 Z "></path>
                    </g>
                </svg>`;
    }

    public getFileIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z "></path>
                    </g>
                </svg>`;
    }

    public getProgramIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 4 4 L 4 28 L 28 28 L 28 4 Z M 6 6 L 26 6 L 26 10 L 6 10 Z M 7 7 L 7 9 L 9 9 L 9 7 Z M 10 7 L 10 9 L 12 9 L 12 7 Z M 13 7 L 13 9 L 15 9 L 15 7 Z M 6 12 L 26 12 L 26 26 L 6 26 Z "></path>
                    </g>
                </svg>`;
    }

    public getSearchIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
                    </g>
                </svg>`;
    }

    public getEmailIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path style=" " d="M 3 8 L 3 26 L 29 26 L 29 8 Z M 7.3125 10 L 24.6875 10 L 16 15.78125 Z M 5 10.875 L 15.4375 17.84375 L 16 18.1875 L 16.5625 17.84375 L 27 10.875 L 27 24 L 5 24 Z "></path>
                    </g>
                </svg>`;
    }
}
