import { useContextBridge, useSearchResultItems, useSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { getImageUrl } from "@Core/getImageUrl";
import { Badge, Button, Field, Input, Slider, Switch, Text, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SearchEngine = () => {
    const { t } = useTranslation();
    const ns = "settingsSearchEngine";
    const { contextBridge } = useContextBridge();
    const { searchResultItems } = useSearchResultItems();

    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting({
        key: "searchEngine.automaticRescan",
        defaultValue: true,
    });

    const { value: rescanIntervalInSeconds, updateValue: setRescanIntervalInSeconds } = useSetting({
        key: "searchEngine.rescanIntervalInSeconds",
        defaultValue: 60,
    });

    const { value: fuzziness, updateValue: setFuzziness } = useSetting({
        key: "searchEngine.fuzziness",
        defaultValue: 0.5,
    });

    const { value: maxResultLength, updateValue: setMaxResultLength } = useSetting({
        key: "searchEngine.maxResultLength",
        defaultValue: 50,
    });

    const [excludedIds, setExcludedIds] = useState<string[]>(contextBridge.getExcludedSearchResultItemIds());

    const removeExcludedSearchResultItem = async (id: string) => {
        await contextBridge.removeExcludedSearchResultItem(id);
        setExcludedIds(contextBridge.getExcludedSearchResultItemIds());
    };

    const excludedSearchResultItems = searchResultItems.filter((f) => excludedIds.includes(f.id));

    return (
        <SectionList>
            <Section>
                <Field label={t("automaticRescan", { ns })}>
                    <Switch
                        checked={automaticRescanEnabled}
                        onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("rescanIntervalInSeconds", { ns })} validationState="none">
                    <Input
                        value={`${rescanIntervalInSeconds}`}
                        onChange={(_, { value }) => setRescanIntervalInSeconds(Number(value))}
                        type="number"
                        disabled={!automaticRescanEnabled}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={`${t("fuzziness", { ns })}: ${fuzziness}`} hint="0 = strict search, 1 = loose search">
                    <Slider
                        value={fuzziness}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(_, { value }) => setFuzziness(value)}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("maxResultLength", { ns })}>
                    <Input
                        value={`${maxResultLength}`}
                        min={1}
                        max={9999}
                        onChange={(_, { value }) => setMaxResultLength(Number(value))}
                        type="number"
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("excludedItems", { ns })}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {excludedSearchResultItems.length ? null : <Text italic>{t("noExcludedItems", { ns })}</Text>}
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
                                            onDarkBackground: contextBridge.themeShouldUseDarkColors(),
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
                                                <Tooltip content={t("removeExcludedItem", { ns })} relationship="label">
                                                    <DismissRegular fontSize={14} />
                                                </Tooltip>
                                            }
                                        />
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
