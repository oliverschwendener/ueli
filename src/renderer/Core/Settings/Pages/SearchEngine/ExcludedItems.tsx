import { useSearchResultItems } from "@Core/Hooks";
import { getImageUrl } from "@Core/getImageUrl";
import { Badge, Button, Input, Text, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ExcludedItems = () => {
    const { t } = useTranslation("settingsSearchEngine");
    const { searchResultItems } = useSearchResultItems();

    const [excludedIds, setExcludedIds] = useState<string[]>(window.ContextBridge.getExcludedSearchResultItemIds());

    const removeExcludedSearchResultItem = async (id: string) => {
        await window.ContextBridge.removeExcludedSearchResultItem(id);
        setExcludedIds(window.ContextBridge.getExcludedSearchResultItemIds());
    };

    const excludedSearchResultItems = searchResultItems.filter((f) => excludedIds.includes(f.id));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {excludedSearchResultItems.length ? null : <Text italic>{t("noExcludedItems")}</Text>}
            {excludedSearchResultItems.map(({ id, name, image, description }) => (
                <Input
                    key={`excludedItem-${id}`}
                    readOnly
                    value={name}
                    contentBefore={
                        <img
                            alt="Excluded search result item image"
                            style={{ width: 16, height: 16 }}
                            src={getImageUrl({
                                image,
                                shouldPreferDarkColors: window.ContextBridge.themeShouldUseDarkColors(),
                            })}
                        />
                    }
                    contentAfter={
                        <div>
                            <Badge size="small" appearance="ghost">
                                {description}
                            </Badge>
                            <Button
                                size="small"
                                appearance="subtle"
                                onClick={() => removeExcludedSearchResultItem(id)}
                                icon={
                                    <Tooltip content={t("removeExcludedItem")} relationship="label" withArrow>
                                        <DismissRegular fontSize={14} />
                                    </Tooltip>
                                }
                            />
                        </div>
                    }
                />
            ))}
        </div>
    );
};
