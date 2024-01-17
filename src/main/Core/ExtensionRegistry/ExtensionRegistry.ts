import type { Extension } from "..";
import type { ExtensionRegistry as ExtensionRegsitryInterface } from "./Contract";

export class ExtensionRegistry implements ExtensionRegsitryInterface {
    private readonly extensions: Record<string, Extension> = {};

    public register(extension: Extension) {
        if (this.extensions[extension.id]) {
            throw new Error(`Extension with id "${extension.id}" is already registered`);
        }

        this.extensions[extension.id] = extension;
    }

    public getById(extensionId: string): Extension {
        const extension = this.extensions[extensionId];

        if (extension) {
            return extension;
        }

        throw new Error(`Unable to find extension with id "${extensionId}"`);
    }

    public getAll(): Extension[] {
        return Object.values(this.extensions);
    }
}
