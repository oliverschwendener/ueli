const isValidKeyCode = (keyCode: string): boolean => {
    const validators = [
        (keyCode: string) => new RegExp(/^[0-9]{1}$/).test(keyCode),
        (keyCode: string) => new RegExp(/^[a-zA-Z]{1}$/).test(keyCode),
        (keyCode: string) =>
            [
                "F1",
                "F2",
                "F3",
                "F4",
                "F5",
                "F6",
                "F7",
                "F8",
                "F9",
                "F10",
                "F11",
                "F12",
                "F13",
                "F14",
                "F15",
                "F16",
                "F17",
                "F18",
                "F19",
                "F20",
                "F21",
                "F22",
                "F23",
                "F24",
            ].includes(keyCode),
        (keyCode: string) => new RegExp(/^num[0-9]{1}$/).test(keyCode),
        (keyCode: string) =>
            [
                "Plus",
                "Space",
                "Tab",
                "Capslock",
                "Numlock",
                "Scrolllock",
                "Backspace",
                "Delete",
                "Insert",
                "Return",
                "Up",
                "Down",
                "Left",
                "Right",
                "Home",
                "End",
                "PageUp",
                "PageDown",
                "Escape",
                "VolumeUp",
                "VolumeDown",
                "VolumeMute",
                "MediaNextTrack",
                "MediaPreviousTrack",
                "MediaStop",
                "MediaPlayPause",
                "PrintScreen",
            ].includes(keyCode),
    ];

    return validators.some((validator) => validator(keyCode));
};

const isValidModifier = (modifier: string): boolean => {
    return [
        "Command",
        "Cmd",
        "Control",
        "Ctrl",
        "CommandOrControl",
        "CmdOrCtrl",
        "Alt",
        "Option",
        "AltGr",
        "Shift",
        "Super",
        "Meta",
    ].includes(modifier);
};

export const isValidHotkey = (hotkey: string) => {
    const parts = hotkey.split("+");
    const hasModifier = parts.length > 1;
    const keyCode = hasModifier ? parts[1] : parts[0];
    const modifier = hasModifier ? parts[0] : undefined;

    return isValidKeyCode(keyCode) && (modifier ? isValidModifier(modifier) : true);
};
