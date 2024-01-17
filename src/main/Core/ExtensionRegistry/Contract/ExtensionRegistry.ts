import type { Extension } from "@Core/Extension/Contract";

export interface ExtensionRegistry {
    register(extension: Extension);
    getById(extensionId: string): Extension;
    getAll(): Extension[];
}
