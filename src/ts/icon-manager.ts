export interface IconManager {
    getFolderIcon(): string;
    getFileIcon(): string;
    getProgramIcon(): string;
    getSearchIcon(): string;
}

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
                </svg>`
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
}

export class MacOsIconManager implements IconManager {
    public getFileIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                    <g id="surface1">
                        <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z "></path>
                    </g>
                </svg>`;
    }

    public getFolderIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 5 4 C 3.3544268 4 2 5.3555411 2 7 L 2 16 L 2 26 L 2 43 C 2 44.644459 3.3544268 46 5 46 L 45 46 C 46.645063 46 48 44.645063 48 43 L 48 26 L 48 16 L 48 11 C 48 9.3549372 46.645063 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.562937 10 46 10.437063 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4364589 4.4355732 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 26 L 46 43 C 46 43.562937 45.562937 44 45 44 L 5 44 C 4.4355732 44 4 43.563541 4 43 L 4 26 L 4 16 C 4 15.43497 4.4349698 15 5 15 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"></path>
                </svg>`;
    }

    public getProgramIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 7 7 C 5.3550302 7 4 8.3550302 4 10 L 4 40 C 4 41.64497 5.3550302 43 7 43 L 43 43 C 44.64497 43 46 41.64497 46 40 L 46 10 C 46 8.3550302 44.64497 7 43 7 L 7 7 z M 7 9 L 43 9 C 43.56503 9 44 9.4349698 44 10 L 44 13 L 6 13 L 6 10 C 6 9.4349698 6.4349698 9 7 9 z M 8 10 A 1 1 0 0 0 7 11 A 1 1 0 0 0 8 12 A 1 1 0 0 0 9 11 A 1 1 0 0 0 8 10 z M 11 10 A 1 1 0 0 0 10 11 A 1 1 0 0 0 11 12 A 1 1 0 0 0 12 11 A 1 1 0 0 0 11 10 z M 14 10 A 1 1 0 0 0 13 11 A 1 1 0 0 0 14 12 A 1 1 0 0 0 15 11 A 1 1 0 0 0 14 10 z M 6 15 L 44 15 L 44 40 C 44 40.56503 43.56503 41 43 41 L 7 41 C 6.4349698 41 6 40.56503 6 40 L 6 15 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"></path>
                </svg>`;
    }

    public getSearchIcon(): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1">
                    <g id="surface1">
                        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z "></path>
                    </g>
                </svg>`;
    }
}