import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

export class SafeStorageEncryptionModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const safeStorage = dependencyRegistry.get("SafeStorage");

        dependencyRegistry.register("SafeStorageEncryption", new SafeStorageEncryption(safeStorage));
    }
}
