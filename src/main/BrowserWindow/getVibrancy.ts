type Vibrancy =
    | "content"
    | "fullscreen-ui"
    | "header"
    | "hud"
    | "menu"
    | "popover"
    | "selection"
    | "sheet"
    | "sidebar"
    | "titlebar"
    | "tooltip"
    | "under-page"
    | "under-window"
    | "window";

export const getVibrancy = (vibrancy: string): Vibrancy | null => {
    const allowedValues: Vibrancy[] = [
        "content",
        "fullscreen-ui",
        "header",
        "hud",
        "menu",
        "popover",
        "selection",
        "sheet",
        "sidebar",
        "titlebar",
        "tooltip",
        "under-page",
        "under-window",
        "window",
    ];

    return allowedValues.includes(vibrancy as Vibrancy) ? (vibrancy as Vibrancy) : null;
};
