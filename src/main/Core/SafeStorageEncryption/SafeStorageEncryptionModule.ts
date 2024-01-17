import type { DependencyRegistry } from "..";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

export class SafeStorageEncryptionModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const safeStorage = dependencyRegistry.get("SafeStorage");

        dependencyRegistry.register("SafeStorageEncryption", new SafeStorageEncryption(safeStorage));
    }
}
