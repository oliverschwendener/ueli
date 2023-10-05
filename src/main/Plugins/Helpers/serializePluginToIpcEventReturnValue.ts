import type { UeliPlugin } from "@common/UeliPlugin";

export const serializePluginToIpcEventReturnValue = ({
    id,
    name,
    nameTranslationKey,
    supportedOperatingSystems,
}: UeliPlugin) => ({
    id,
    name,
    nameTranslationKey,
    supportedOperatingSystems,
});
