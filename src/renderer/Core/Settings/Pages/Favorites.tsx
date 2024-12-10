import { useFavorites, useSearchResultItems } from "@Core/Hooks";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import { getImageUrl } from "@Core/getImageUrl";
import { Badge, Button, Input, Text, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { SettingGroup } from "../SettingGroup";

export const Favorites = () => {
    const { t } = useTranslation("settingsFavorites");
    const { searchResultItems } = useSearchResultItems();
    const { favorites } = useFavorites();

    const removeFavorite = async (id: string) => {
        await window.ContextBridge.removeFavorite(id);
    };

    const favoriteSearchResultItems = searchResultItems.filter((s) => favorites.includes(s.id));

    return (
        <SettingGroupList>
            <SettingGroup title={t("title")}>
                {!favoriteSearchResultItems.length ? <Text italic>You don't have any favorites</Text> : null}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {favoriteSearchResultItems.map((s) => (
                        <Input
                            key={s.id}
                            width={"100%"}
                            value={s.name}
                            readOnly
                            contentBefore={
                                <div style={{ width: 16, height: 16, display: "flex", alignItems: "center" }}>
                                    <img
                                        alt={s.name}
                                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        src={getImageUrl({
                                            image: s.image,
                                            shouldPreferDarkColors: window.ContextBridge.themeShouldUseDarkColors(),
                                        })}
                                    />
                                </div>
                            }
                            contentAfter={
                                <div>
                                    <Badge size="small" appearance="ghost">
                                        {s.description}
                                    </Badge>
                                    <Tooltip content={t("remove")} relationship="label" withArrow>
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            icon={<DismissRegular />}
                                            onClick={() => removeFavorite(s.id)}
                                        />
                                    </Tooltip>
                                </div>
                            }
                        />
                    ))}
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
