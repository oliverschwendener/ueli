import type { DependencyInjector } from "..";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

export class SafeStorageEncryptionModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const safeStorage = dependencyInjector.getInstance("SafeStorage");

        dependencyInjector.registerInstance("SafeStorageEncryption", new SafeStorageEncryption(safeStorage));
    }
}
