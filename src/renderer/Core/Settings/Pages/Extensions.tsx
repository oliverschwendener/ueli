import { useContextBridge, useSetting } from "@Core/Hooks";
import { getImageUrl } from "@Core/getImageUrl";
import {
    Button,
    Link,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Toast,
    ToastTitle,
    Toaster,
    useId,
    useToastController,
} from "@fluentui/react-components";
import { ArrowClockwiseRegular } from "@fluentui/react-icons";
import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

export const Extensions = () => {
    const { t } = useTranslation();
    const ns = "settingsExtensions";
    const { contextBridge } = useContextBridge();
    const toasterId = useId("rescanToasterId");
    const { dispatchToast } = useToastController(toasterId);

    const {
        getAvailableExtensions,
        extensionDisabled: disableExtension,
        extensionEnabled: enableExtension,
    } = contextBridge;

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting({
        key: "extensions.enabledExtensionIds",
        defaultValue: ["ApplicationSearch", "UeliCommand"],
    });

    const isEnabled = (extensionId: string) => enabledExtensionIds.includes(extensionId);

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        enableExtension(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        disableExtension(extensionId);
    };

    const triggerExtensionRescan = async (event: MouseEvent, extensionId: string) => {
        event.preventDefault();
        await contextBridge.triggerExtensionRescan(extensionId);
        const { name, nameTranslation } = contextBridge.getExtension(extensionId);

        dispatchToast(
            <Toast>
                <ToastTitle>
                    {nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name}:{" "}
                    {t("successfulRescan", { ns })}
                </ToastTitle>
            </Toast>,
            { intent: "success", position: "bottom" },
        );
    };

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Table arial-label="Default table">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell key="name">{t("name", { ns })}</TableHeaderCell>
                        <TableHeaderCell key="author">{t("author", { ns })}</TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="enabled">
                            {t("enabled", { ns })}
                        </TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="rescan">
                            {t("rescan", { ns })}
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getAvailableExtensions().map(({ author, id, name, nameTranslation, image }) => {
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    <TableCellLayout>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <div style={{ width: 20, height: 20 }}>
                                                <img
                                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                                    src={getImageUrl({
                                                        image,
                                                        shouldPreferDarkColors:
                                                            contextBridge.themeShouldUseDarkColors(),
                                                    })}
                                                />
                                            </div>
                                            {nameTranslation
                                                ? t(nameTranslation.key, { ns: nameTranslation.namespace })
                                                : name}
                                        </div>
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        <Link
                                            appearance="subtle"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                await contextBridge.openExternal(
                                                    `https://github.com/${author.githubUserName}`,
                                                );
                                            }}
                                        >
                                            {author.name}
                                        </Link>
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={isEnabled(id)}
                                        onChange={async (_, { checked }) =>
                                            checked ? await enable(id) : await disable(id)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            appearance="subtle"
                                            onClick={(event) => triggerExtensionRescan(event, id)}
                                            disabled={!isEnabled(id)}
                                            icon={<ArrowClockwiseRegular fontSize={14} />}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};
