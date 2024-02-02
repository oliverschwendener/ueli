import { ExcludedSearchResultItem } from "@common/Core";
import { Button, Field, Input, Slider, Switch, Text, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const SearchEngine = () => {
    const { t } = useTranslation();
    const ns = "settingsSearchEngine";
    const { contextBridge } = useContextBridge();

    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting(
        "searchEngine.automaticRescan",
        true,
    );
    const { value: rescanIntervalInSeconds, updateValue: setRescanIntervalInSeconds } = useSetting(
        "searchEngine.rescanIntervalInSeconds",
        60,
    );

    const { value: fuzziness, updateValue: setFuzziness } = useSetting("searchEngine.fuzziness", 0.5);

    const { value: maxResultLength, updateValue: setMaxResultLength } = useSetting("searchEngine.maxResultLength", 50);

    const [excludedSearchResultItems, setExcludedSearchResultItems] = useState<ExcludedSearchResultItem[]>(
        contextBridge.getExcludedSearchResultItems(),
    );

    const removeExcludedSearchResultItem = async (id: string) => {
        await contextBridge.removeExcludedSearchResultItem(id);
        setExcludedSearchResultItems(contextBridge.getExcludedSearchResultItems());
    };

    return (
        <SectionList>
            <Section>
                <Field label={t("automaticRescan", { ns })}>
                    <Switch
                        aria-labelledby="searchEngine.automaticRescan"
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
                        aria-labelledby="searchEngine.fuzziness"
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
                        {excludedSearchResultItems.map((excludedItem) => (
                            <Input
                                key={`excludedItem-${excludedItem.id}`}
                                readOnly
                                value={excludedItem.name}
                                contentBefore={
                                    excludedItem.imageUrl ? (
                                        <img
                                            alt="Excluded search result item image"
                                            style={{ width: 16, height: 16 }}
                                            src={excludedItem.imageUrl}
                                        />
                                    ) : null
                                }
                                contentAfter={
                                    <Button
                                        size="small"
                                        appearance="subtle"
                                        onClick={() => removeExcludedSearchResultItem(excludedItem.id)}
                                        icon={
                                            <Tooltip content={t("removeExcludedItem", { ns })} relationship="label">
                                                <DismissRegular fontSize={14} />
                                            </Tooltip>
                                        }
                                    />
                                }
                            />
                        ))}
                    </div>
                </Field>
            </Section>
        </SectionList>
    );
};
