import type { Resources, Translations } from "@shared/Core/Translator";

export const getExtensionResources = (
    extensionTranslations: {
        extensionId: string;
        resources: Resources<Translations>;
    }[],
): {
    namespace: string;
    resources: Resources<Translations>;
}[] =>
    extensionTranslations.map(({ extensionId, resources }) => ({
        namespace: `extension[${extensionId}]`,
        resources,
    }));
