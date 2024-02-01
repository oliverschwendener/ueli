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
import { useTranslation } from "react-i18next";
import { useContextBridge, useSetting } from "../../Hooks";

export const Extensions = () => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const toasterId = useId("rescanToasterId");
    const { dispatchToast } = useToastController(toasterId);

    const {
        getAvailableExtensions,
        extensionDisabled: disableExtension,
        extensionEnabled: enableExtension,
    } = contextBridge;

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting(
        "extensions.enabledExtensionIds",
        ["ApplicationSearch", "UeliCommand"],
    );

    const isEnabled = (extensionId: string) => enabledExtensionIds.includes(extensionId);

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        enableExtension(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        disableExtension(extensionId);
    };

    const triggerExtensionRescan = async (event: React.MouseEvent, extensionId: string) => {
        event.preventDefault();
        await contextBridge.triggerExtensionRescan(extensionId);
        const { name, nameTranslationKey } = contextBridge.getExtension(extensionId);

        dispatchToast(
            <Toast>
                <ToastTitle>
                    {nameTranslationKey ? t(nameTranslationKey) : name}: {t("settingsPage.extensions.successfulRescan")}
                </ToastTitle>
            </Toast>,
            { intent: "success" },
        );
    };

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Table arial-label="Default table">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell key="name">{t("settingsPage.extensions.name")}</TableHeaderCell>
                        <TableHeaderCell key="author">{t("settingsPage.extensions.author")}</TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="enabled">
                            {t("settingsPage.extensions.enabled")}
                        </TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="rescan">
                            {t("settingsPage.extensions.rescan")}
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getAvailableExtensions().map(({ author, id, name, nameTranslationKey, imageUrl }) => {
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
                                                <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={imageUrl} />
                                            </div>
                                            {nameTranslationKey ? t(nameTranslationKey) : name}
                                        </div>
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        <Link
                                            appearance="subtle"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                contextBridge.openExternal(
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
