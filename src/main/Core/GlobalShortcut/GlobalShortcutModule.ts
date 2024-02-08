import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { isValidHotkey } from "@common/Core/Hotkey";

export class GlobalShortcutModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const globalShortcut = dependencyRegistry.get("GlobalShortcut");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const logger = dependencyRegistry.get("Logger");

        const registerHotkey = () => {
            const hotkey = settingsManager.getValue("general.hotkey", "Alt+Space");

            if (!isValidHotkey(hotkey)) {
                logger.error(`Unable to register hotkey. Reason: unexpected hotkey ${hotkey}`);
            }

            globalShortcut.unregisterAll();
            globalShortcut.register(hotkey, () => eventEmitter.emitEvent("hotkeyPressed"));
        };

        registerHotkey();

        eventSubscriber.subscribe("settingUpdated[general.hotkey]", () => registerHotkey());
    }
}
