import { isValidHotkey } from "@common/Core/Hotkey";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class GlobalShortcutModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const globalShortcut = moduleRegistry.get("GlobalShortcut");
        const eventEmitter = moduleRegistry.get("EventEmitter");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const logger = moduleRegistry.get("Logger");

        const hotkeyIsEnabled = () => settingsManager.getValue("general.hotkey.enabled", true);

        const registerHotkey = () => {
            let hotkey = settingsManager.getValue("general.hotkey", "Alt+Space");
            const operatingSystem = moduleRegistry.get("OperatingSystem");

            // Replace AltGr with Ctrl+Alt on Windows due to OS mapping
            if(operatingSystem === "Windows") {
                hotkey = hotkey.replace('AltGr', 'Ctrl+Alt');
            }              

            if (!isValidHotkey(hotkey)) {
                logger.error(`Unable to register hotkey. Reason: unexpected hotkey ${hotkey}`);
            }

            globalShortcut.unregisterAll();
            globalShortcut.register(hotkey, () => eventEmitter.emitEvent("hotkeyPressed"));
        };

        if (hotkeyIsEnabled()) {
            registerHotkey();
        }

        eventSubscriber.subscribe("settingUpdated[general.hotkey]", () => registerHotkey());

        eventSubscriber.subscribe("settingUpdated[general.hotkey.enabled]", () => {
            if (hotkeyIsEnabled()) {
                registerHotkey();
            } else {
                globalShortcut.unregisterAll();
            }
        });
    }
}
