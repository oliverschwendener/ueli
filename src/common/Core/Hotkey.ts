const isValidKeyCode = (keyCode: string): boolean => {
    const validators = [
        (keyCode: string) => /^[0-9]$/.test(keyCode), // 0-9
        (keyCode: string) => /^[a-zA-Z]$/.test(keyCode), // a-z, A-Z
        (keyCode: string) => /^(F[1-9]|F1[0-9]|F2[0-4])$/.test(keyCode), // F1-F24
        (keyCode: string) => /^num[0-9]$/.test(keyCode), // num0-num9
        (keyCode: string) => /^([)!@#$%^&*(:;+=<,_\->.?/~`{\][|\\}"])$/.test(keyCode),
        (keyCode: string) =>
            /^(Plus|Space|Tab|Capslock|Numlock|Scrolllock|Backspace|Delete|Insert|Return|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/.test(
                keyCode,
            ),
    ];

    return validators.some((validator) => validator(keyCode));
};

const isValidModifier = (modifier: string): boolean =>
    /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super|Meta)$/.test(modifier);

const hasDuplicates = (modifiers: string[]): boolean => modifiers.length !== new Set(modifiers).size;

/**
 * Checks if the given string is a valid hotkey.
 * A valid hotkey is a combination of a modifier and a key code, e.g. `CmdOrCtrl+Space`. For more information, see
 * https://www.electronjs.org/docs/api/accelerator.
 * @param hotkey The hotkey to check, e.g. `CmdOrCtrl+Space`.
 * @returns `true` if the hotkey is valid, otherwise `false`.
 */
export const isValidHotkey = (hotkey: string) => {
    const parts = hotkey.split("+");
    const hasModifiers = parts.length > 1;
    const keyCode = hasModifiers ? parts[parts.length - 1] : parts[0];
    const modifiers = hasModifiers ? parts.slice(0, parts.length - 1) : undefined;

    return (
        isValidKeyCode(keyCode) &&
        (modifiers ? modifiers.every((modifier) => isValidModifier(modifier)) && !hasDuplicates(modifiers) : true)
    );
};
