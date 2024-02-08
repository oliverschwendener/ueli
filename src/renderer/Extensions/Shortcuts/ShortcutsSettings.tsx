import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Shortcut } from "@common/Extensions/Shortcuts";
import { Button, Field, Input, Tooltip } from "@fluentui/react-components";
import { AddCircleRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditModal } from "./EditModal";
import { createTemporaryShortcut } from "./createTemporaryShortcut";

export const ShortcutsSettings = () => {
    const { t } = useTranslation();
    const ns = "extension[Shortcuts]";

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

    return (
        <SectionList>
            <Section>
                <Field label={t("shortcuts", { ns })}>
                    {!shortcuts.length ? <>No shortcuts yet</> : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {shortcuts.map((s) => (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Input
                                    value={s.name}
                                    readOnly
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
                        ))}
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
