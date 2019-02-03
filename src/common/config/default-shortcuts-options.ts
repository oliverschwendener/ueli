import { ShortcutsOptions } from "./shortcuts-options";
import { Icon } from "../icon/icon";
import { IconType } from "../icon/icon-type";

export const defaultShortcutsOptions: ShortcutsOptions = {
    isEnabled: true,
    shortcuts: [],
};

export const defaultShortcutIcon: Icon = {
    parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1">
    <g id="surface1">
    <path style=" " d="M 16.800781 19.300781 L 23.5 13.398438 C 23.699219 13.199219 23.699219 12.800781 23.5 12.601563 L 16.800781 6.699219 C 16.5 6.398438 16 6.699219 16 7.101563 L 16 10 C 2.898438 10 3 24 3 24 C 3 24 3.898438 16 16 16 L 16 18.898438 C 16 19.300781 16.5 19.601563 16.800781 19.300781 Z "></path>
    </g>
    </svg>`,
    type: IconType.SVG,
};
