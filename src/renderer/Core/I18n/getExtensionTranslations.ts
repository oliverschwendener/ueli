import type { Translations } from "@common/Core/Extension";

export const getExtensionTranslations = (
    extensionTranslations: { extensionId: string; translations: Translations }[],
): { namespace: string; translations: Translations }[] =>
    extensionTranslations.map(({ extensionId, translations }) => ({
        namespace: `extension[${extensionId}]`,
        translations,
    }));
