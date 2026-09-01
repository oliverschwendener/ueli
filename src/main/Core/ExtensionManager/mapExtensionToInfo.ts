import type { Extension } from "@Core/Extension";
import type { ExtensionInfo } from "@shared/Core";

export const mapExtensionToInfo = (extension: Extension): ExtensionInfo => ({
    id: extension.id,
    name: extension.name,
    nameTranslation: extension.nameTranslation,
    image: extension.getImage(),
    author: extension.author,
});
