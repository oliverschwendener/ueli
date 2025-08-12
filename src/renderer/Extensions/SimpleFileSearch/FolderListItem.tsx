import type { FolderSetting } from "@common/Extensions/SimpleFileSearch";
import { Badge, Button, Caption1, Card, CardHeader, Text, tokens, Tooltip } from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { EditDialog } from "./EditDialog";
import { RemoveDialog } from "./RemoveDialog";

type FolderListItemProps = {
    folderSetting: FolderSetting;
    removeFolderSetting: (id: string) => void;
    updateFolderSetting: (folderSetting: FolderSetting) => void;
};

export const FolderListItem = ({ folderSetting, removeFolderSetting, updateFolderSetting }: FolderListItemProps) => {
    const { t } = useTranslation("extension[SimpleFileSearch]");

    return (
        <Card appearance="filled-alternative">
            <CardHeader
                header={<Text weight="semibold">{folderSetting.path}</Text>}
                description={
                    <div
                        style={{
                            marginTop: tokens.spacingVerticalM,
                            display: "flex",
                            flexDirection: "column",
                            gap: tokens.spacingHorizontalXXS,
                        }}
                    >
                        <Caption1>
                            {t("recursive")}:{" "}
                            {folderSetting.recursive ? (
                                <Badge appearance="tint" size="small">
                                    Yes
                                </Badge>
                            ) : (
                                <Badge appearance="tint" size="small" color="informative">
                                    No
                                </Badge>
                            )}
                        </Caption1>
                        <Caption1>
                            {t("excludeHiddenFiles")}:{" "}
                            {folderSetting.excludeHiddenFiles ? (
                                <Badge appearance="tint" size="small">
                                    Yes
                                </Badge>
                            ) : (
                                <Badge appearance="tint" size="small" color="informative">
                                    No
                                </Badge>
                            )}
                        </Caption1>
                        <Caption1>
                            {t("searchFor")}: {t(`searchFor.${folderSetting.searchFor}`)}
                        </Caption1>
                    </div>
                }
                action={
                    <div style={{ display: "flex", gap: tokens.spacingHorizontalXS }}>
                        <EditDialog
                            title={t("editFolder")}
                            trigger={
                                <Tooltip withArrow relationship="label" content={t("edit")}>
                                    <Button size="small" appearance="subtle" icon={<EditRegular />} />
                                </Tooltip>
                            }
                            confirm={t("save")}
                            cancel={t("cancel")}
                            folderSetting={folderSetting}
                            onSave={updateFolderSetting}
                        />
                        <RemoveDialog onConfirm={() => removeFolderSetting(folderSetting.id)} />
                    </div>
                }
            />
        </Card>
    );
};
