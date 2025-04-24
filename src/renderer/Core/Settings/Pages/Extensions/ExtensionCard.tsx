import type { ExtensionInfo } from "@common/Core";
import { getImageUrl } from "@Core/getImageUrl";
import {
    Button,
    Caption1,
    Card,
    CardHeader,
    Link,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Subtitle2,
    tokens,
} from "@fluentui/react-components";
import {
    ArrowClockwiseRegular,
    BookRegular,
    MoreHorizontalRegular,
    PowerFilled,
    SettingsRegular,
} from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

type ExtensionCardProps = {
    extension: ExtensionInfo;
    isEnabled: boolean;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    shouldUseDarkColors: boolean;
    openSettings: () => void;
    rescan: () => Promise<void>;
    openReadme: () => void;
};

export const ExtensionCard = ({
    extension,
    shouldUseDarkColors,
    isEnabled,
    enable,
    disable,
    openSettings,
    rescan,
    openReadme,
}: ExtensionCardProps) => {
    const { t } = useTranslation();

    const getTranslatedExtensionName = ({ nameTranslation, name }: ExtensionInfo) =>
        nameTranslation ? t(nameTranslation.key, { ns: nameTranslation.namespace }) : name;

    const openAuthorGithubProfile = async () =>
        window.ContextBridge.openExternal(`https://github.com/${extension.author.githubUserName}`);

    const toggle = () => {
        if (isEnabled) {
            disable();
        } else {
            enable();
        }
    };

    return (
        <Card appearance="filled-alternative">
            <CardHeader
                image={
                    <div style={{ width: 28, height: 28 }}>
                        <img
                            alt={extension.name}
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                            src={getImageUrl({ image: extension.image, shouldUseDarkColors })}
                        />
                    </div>
                }
                header={<Subtitle2>{getTranslatedExtensionName(extension)}</Subtitle2>}
                description={
                    <Link
                        onClick={async (e) => {
                            e.preventDefault();
                            await openAuthorGithubProfile();
                        }}
                    >
                        <Caption1>{extension.author.name}</Caption1>
                    </Link>
                }
                action={
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: tokens.spacingHorizontalS,
                            alignItems: "center",
                        }}
                    >
                        <Menu>
                            <MenuTrigger>
                                <Button appearance="subtle" icon={<MoreHorizontalRegular />} />
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    {isEnabled && (
                                        <MenuItem icon={<SettingsRegular />} onClick={openSettings}>
                                            {t("settings", { ns: "settingsExtensions" })}
                                        </MenuItem>
                                    )}
                                    {isEnabled && (
                                        <MenuItem icon={<ArrowClockwiseRegular />} onClick={rescan}>
                                            {t("rescan", { ns: "settingsExtensions" })}
                                        </MenuItem>
                                    )}
                                    <MenuItem icon={<BookRegular />} onClick={openReadme}>
                                        {t("readme", { ns: "settingsExtensions" })}
                                    </MenuItem>

                                    <MenuItem onClick={toggle} icon={<PowerFilled />}>
                                        {isEnabled
                                            ? t("disable", { ns: "settingsExtensions" })
                                            : t("enable", { ns: "settingsExtensions" })}
                                    </MenuItem>
                                </MenuList>
                            </MenuPopover>
                        </Menu>
                    </div>
                }
            />
        </Card>
    );
};
