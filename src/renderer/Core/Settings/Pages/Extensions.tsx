import { useSetting } from "@Core/Hooks";
import { ThemeContext } from "@Core/Theme";
import { getImageUrl } from "@Core/getImageUrl";
import {
    Avatar,
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
import { useContext, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

export const Extensions = () => {
    const { shouldUseDarkColors } = useContext(ThemeContext);
    const { t } = useTranslation();
    const toasterId = useId("rescanToasterId");
    const { dispatchToast } = useToastController(toasterId);

    const { value: enabledExtensionIds, updateValue: setEnabledExtensionIds } = useSetting({
        key: "extensions.enabledExtensionIds",
        defaultValue: ["ApplicationSearch", "UeliCommand"],
    });

    const isEnabled = (extensionId: string) => enabledExtensionIds.includes(extensionId);

    const enable = async (extensionId: string) => {
        await setEnabledExtensionIds([extensionId, ...enabledExtensionIds]);
        window.ContextBridge.extensionEnabled(extensionId);
    };

    const disable = async (extensionId: string) => {
        await setEnabledExtensionIds(enabledExtensionIds.filter((p) => p !== extensionId));
        window.ContextBridge.extensionDisabled(extensionId);
    };

    const attemptRescan = async (extensionId: string): Promise<{ success: boolean }> => {
        try {
            await window.ContextBridge.triggerExtensionRescan(extensionId);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    const triggerExtensionRescan = async (event: MouseEvent, extensionId: string) => {
        event.preventDefault();

        const { success } = await attemptRescan(extensionId);
        const { name, nameTranslation } = window.ContextBridge.getExtension(extensionId);

        dispatchToast(
            <Toast>
                <ToastTitle>
                    {nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name}:{" "}
                    {success
                        ? t("successfulRescan", { ns: "settingsExtensions" })
                        : t("failedRescan", { ns: "settingsExtensions" })}
                </ToastTitle>
            </Toast>,
            { intent: success ? "success" : "error", position: "bottom" },
        );
    };

    return (
        <>
            <Toaster toasterId={toasterId} />
            <Table arial-label="Default table">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell key="name">{t("name", { ns: "settingsExtensions" })}</TableHeaderCell>
                        <TableHeaderCell key="author">{t("author", { ns: "settingsExtensions" })}</TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="enabled">
                            {t("enabled", { ns: "settingsExtensions" })}
                        </TableHeaderCell>
                        <TableHeaderCell style={{ width: 50 }} key="rescan">
                            {t("rescan", { ns: "settingsExtensions" })}
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {window.ContextBridge.getAvailableExtensions().map(
                        ({ author, id, name, nameTranslation, image }) => {
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
                                                        alt={name}
                                                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                                                        src={getImageUrl({ image, shouldUseDarkColors })}
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
                                                // In order to align the avatar and the text horizontally
                                                style={{ display: "flex", gap: 5, alignItems: "center" }}
                                                appearance="subtle"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await window.ContextBridge.openExternal(
                                                        `https://github.com/${author.githubUserName}`,
                                                    );
                                                }}
                                            >
                                                <Avatar
                                                    name={author.name}
                                                    size={16}
                                                    image={{
                                                        src: `https://github.com/${author.githubUserName}.png?size=16`,
                                                    }}
                                                />
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
                        },
                    )}
                </TableBody>
            </Table>
        </>
    );
};
