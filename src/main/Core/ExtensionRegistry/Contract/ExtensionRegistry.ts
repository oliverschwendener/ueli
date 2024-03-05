import type { Extension } from "@Core/Extension/Contract";

/**
 * Represents a registry for extensions.
 */
export interface ExtensionRegistry {
    /**
     * Registers an extension.
     * @param extension The extension to register.
     * @throws If an extension with the same ID is already registered.
     */
    register(extension: Extension);

    /**
     * Gets an extension by its ID.
     * @param extensionId The ID of the extension.
     * @returns The extension with the given ID.
     * @throws If no extension with the given ID is registered.
     */
    getById(extensionId: string): Extension;

    /**
     * Gets all registered extensions.
     * @returns All registered extensions.
     */
    getAll(): Extension[];
}
