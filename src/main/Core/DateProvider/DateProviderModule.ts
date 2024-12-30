import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { DateProvider } from "./DateProvider";

export class DateProviderModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("DateProvider", new DateProvider());
    }
}
