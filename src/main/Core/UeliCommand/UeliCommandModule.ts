import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const eventEmitter = moduleRegistry.get("EventEmitter");
        const actionHandlerRegistry = moduleRegistry.get("ActionHandlerRegistry");
        const settingsManager = moduleRegistry.get("SettingsManager");

        const ueliCommandInvoker = new UeliCommandInvoker(app, eventEmitter, settingsManager);

        moduleRegistry.register("UeliCommandInvoker", ueliCommandInvoker);

        actionHandlerRegistry.register(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
