import { useFavorites, useSearchResultItems, useSetting } from "@Core/Hooks";
import type { SearchResultItem } from "@common/Core";
import { Body1, Caption1, Card, CardHeader, CardPreview, Subtitle2, Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

type FavoritesListProps = {
    invokeSearchResultItem: (s: SearchResultItem) => Promise<void>;
};

const getGridTemplateColumns = (numberOfColumns: number) => {
    const result = [];

    for (let i = 0; i < numberOfColumns; i++) {
        result.push("1fr");
    }

    return result.join(" ");
};

export const FavoritesList = ({ invokeSearchResultItem }: FavoritesListProps) => {
    const { t } = useTranslation();
    const ns = "settingsFavorites";
    const { searchResultItems } = useSearchResultItems();
    const { favorites } = useFavorites();

    const { value: numberOfColumns } = useSetting({ key: "favorites.numberOfColumns", defaultValue: 3 });

    const favoriteSearchResultItems = searchResultItems.filter((s) => favorites.includes(s.id));

    return (
        <div style={{ padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
            {favoriteSearchResultItems.length ? (
                <Subtitle2>{t("title", { ns })}</Subtitle2>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Body1>{t("noFavorites", { ns })}</Body1>
                </div>
            )}

            <div
                style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: getGridTemplateColumns(numberOfColumns),
                    gap: 10,
                }}
            >
                {favoriteSearchResultItems.map((searchResultItem) => (
                    <Card
                        key={`favorite-${searchResultItem.id}`}
                        selected={false}
                        orientation="horizontal"
                        onClick={() => invokeSearchResultItem(searchResultItem)}
                        onKeyDown={(e) => e.key === "Enter" && invokeSearchResultItem(searchResultItem)}
                    >
                        <CardPreview style={{ paddingLeft: 12, width: 24 }}>
                            <img style={{ width: "100%" }} src={searchResultItem.imageUrl} alt="App Name Document" />
                        </CardPreview>
                        <CardHeader
                            header={<Text weight="semibold">{searchResultItem.name}</Text>}
                            description={
                                <Caption1>
                                    {searchResultItem.descriptionTranslation
                                        ? t(searchResultItem.descriptionTranslation.key, {
                                              ns: searchResultItem.descriptionTranslation.namespace,
                                          })
                                        : searchResultItem.description}
                                </Caption1>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};
