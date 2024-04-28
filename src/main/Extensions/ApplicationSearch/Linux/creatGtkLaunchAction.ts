import type { SearchResultItemAction } from "@common/Core";

export const createGtkLaunchAction = ({
    filePath,
    description,
    descriptionTranslation,
}: {
    filePath: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
}): SearchResultItemAction => {
    return {
        argument: filePath,
        description,
        descriptionTranslation,
        handlerId: "GtkLaunch",
        fluentIcon: "OpenRegular",
    };
};
