import { useContextBridge, useExtensionSetting, useSearchResultItems } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import { getImageUrl } from "@Core/getImageUrl";
import type { Shortcut } from "@common/Extensions/Shortcuts";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { AddCircleRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditModal } from "./EditModal";
import { createTemporaryShortcut } from "./createTemporaryShortcut";

export const ShortcutsSettings = () => {
    const { contextBridge } = useContextBridge();
    const { t } = useTranslation();
    const ns = "extension[Shortcuts]";

    const { searchResultItems } = useSearchResultItems();

    const { value: shortcuts, updateValue: setShortcuts } = useExtensionSetting<Shortcut[]>({
        extensionId: "Shortcuts",
        key: "shortcuts",
    });

    const removeShortcut = (id: string) => {
        setShortcuts(shortcuts.filter((s) => s.id !== id));
    };

    const editShortcut = (shortcut: Shortcut) => {
        setShortcuts(shortcuts.map((s) => (s.id === shortcut.id ? shortcut : s)));
    };

    const addShortcut = (shortcut: Shortcut) => {
        setShortcuts([...shortcuts, shortcut]);
    };

    const getSearchResultItemByShortcutId = (id: string) => {
        const s = searchResultItems.find((s) => s.id === id);
        if (s) {
            return s;
        }
    };

    return (
        <SectionList>
            <Section>
                <Field label={t("shortcuts", { ns })}>
                    {!shortcuts.length ? <>No shortcuts yet</> : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {shortcuts.map((s) => {
                            const searchResultItem = getSearchResultItemByShortcutId(s.id);

                            return (
                                <div key={s.id} style={{ display: "flex", flexDirection: "column" }}>
                                    <Input
                                        value={s.name}
                                        readOnly
                                        contentBefore={
                                            searchResultItem ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        height: 20,
                                                        width: 20,
                                                    }}
                                                >
                                                    <img
                                                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                                                        src={getImageUrl({
                                                            image: searchResultItem.image,
                                                            shouldPreferDarkColors:
                                                                contextBridge.themeShouldUseDarkColors(),
                                                        })}
                                                    />
                                                </div>
                                            ) : null
                                        }
                                        contentAfter={
                                            <>
                                                <EditModal
                                                    title={t("editShortcut", { ns })}
                                                    shortcutToEdit={{ ...s }}
                                                    save={editShortcut}
                                                    dialogTrigger={
                                                        <Tooltip content={t("edit", { ns })} relationship="label">
                                                            <Button
                                                                size="small"
                                                                appearance="subtle"
                                                                icon={<EditRegular />}
                                                            />
                                                        </Tooltip>
                                                    }
                                                />

                                                <Tooltip content={t("remove", { ns })} relationship="label">
                                                    <Button
                                                        size="small"
                                                        appearance="subtle"
                                                        icon={<DismissRegular />}
                                                        onClick={() => removeShortcut(s.id)}
                                                    />
                                                </Tooltip>
                                            </>
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Field>
            </Section>
            <Section>
                <EditModal
                    title={t("createShortcut", { ns })}
                    shortcutToEdit={createTemporaryShortcut()}
                    save={addShortcut}
                    canEditType
                    dialogTrigger={
                        <div>
                            <Button icon={<AddCircleRegular />}>{t("createShortcut", { ns })}</Button>
                        </div>
                    }
                />
            </Section>
        </SectionList>
    );
};
