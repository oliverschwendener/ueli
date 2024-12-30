import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

export class SafeStorageEncryptionModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const safeStorage = moduleRegistry.get("SafeStorage");

        moduleRegistry.register("SafeStorageEncryption", new SafeStorageEncryption(safeStorage));
    }
}
