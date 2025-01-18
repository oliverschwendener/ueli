import type { ExtensionInfo } from "@common/Core";
import type { Extension } from "@Core/Extension";

export const mapExtensionToInfo = (extension: Extension): ExtensionInfo => ({
    id: extension.id,
    name: extension.name,
    nameTranslation: extension.nameTranslation,
    image: extension.getImage(),
    author: extension.author,
});
