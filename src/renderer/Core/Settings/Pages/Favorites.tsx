import { useContextBridge, useFavorites, useSetting } from "@Core/Hooks";
import { Badge, Button, Field, Input, SpinButton, Text, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const Favorites = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const ns = "settingsFavorites";
    const { favorites } = useFavorites();
    const { value: numberOfColumns, updateValue: setNumberOfColumns } = useSetting("favorites.numberOfColumns", 3);

    const removeFavorite = async (id: string) => {
        await contextBridge.removeFavorite(id);
    };

    return (
        <SectionList>
            <Section>
                <Field label={t("numberOfColumns", { ns })}>
                    <SpinButton
                        value={numberOfColumns}
                        onChange={(_, { value }) => value && setNumberOfColumns(value)}
                        min={1}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("title", { ns })}>
                    {!favorites.length ? <Text italic>You don't have any favorites</Text> : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {favorites.map((f) => (
                            <Input
                                width={"100%"}
                                value={f.name}
                                readOnly
                                contentBefore={
                                    <div style={{ width: 16, height: 16, display: "flex", alignItems: "center" }}>
                                        <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={f.imageUrl} />
                                    </div>
                                }
                                contentAfter={
                                    <div>
                                        <Badge size="small" appearance="ghost">
                                            {f.description}
                                        </Badge>
                                        <Tooltip content={t("remove", { ns })} relationship="label">
                                            <Button
                                                size="small"
                                                appearance="subtle"
                                                icon={<DismissRegular />}
                                                onClick={() => removeFavorite(f.id)}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </Field>
            </Section>
        </SectionList>
    );
};
