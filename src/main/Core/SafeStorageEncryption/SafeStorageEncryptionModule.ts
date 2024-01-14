import type { SafeStorage } from "electron";
import type { DependencyInjector } from "..";
import type { SafeStorageEncryption as SafeStorageEncryptionInterface } from "./Contract";
import { SafeStorageEncryption } from "./SafeStorageEncryption";

export class SafeStorageEncryptionModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const safeStorage = dependencyInjector.getInstance<SafeStorage>("SafeStorage");

        dependencyInjector.registerInstance<SafeStorageEncryptionInterface>(
            "SafeStorageEncryption",
            new SafeStorageEncryption(safeStorage),
        );
    }
}
