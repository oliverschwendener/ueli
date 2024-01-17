import type { Extension } from "..";
import type { ExtensionRegistry as ExtensionRegistryInterface } from "./Contract";

export class ExtensionRegistry implements ExtensionRegistryInterface {
    private readonly extensions: Record<string, Extension> = {};

    public register(extension: Extension) {
        if (this.extensions[extension.id]) {
            throw new Error(`Extension with id "${extension.id}" is already registered`);
        }

        this.extensions[extension.id] = extension;
    }

    public getById(extensionId: string): Extension {
        if (!this.extensions[extensionId]) {
            throw new Error(`Unable to find extension with id "${extensionId}"`);
        }

        return this.extensions[extensionId];
    }

    public getAll(): Extension[] {
        return Object.values(this.extensions);
    }
}
