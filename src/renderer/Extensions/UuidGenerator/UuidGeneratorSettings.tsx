import type { UuidFormat, UuidVersion } from "@common/Extensions/UuidGenerator";
import { useExtensionSetting } from "@Core/Hooks";
import { Setting } from "@Core/Settings/Setting";
import { SettingGroup } from "@Core/Settings/SettingGroup";
import { SettingGroupList } from "@Core/Settings/SettingGroupList";
import {
    Button,
    Checkbox,
    DialogTrigger,
    Dropdown,
    Input,
    Label,
    Option,
    Table,
    TableBody,
    TableCell,
    TableCellActions,
    TableCellLayout,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Tooltip,
} from "@fluentui/react-components";
import { AddRegular, DismissRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

export const UuidGeneratorSettings = () => {
    const extensionId = "UuidGenerator";
    const { t } = useTranslation("extension[UuidGenerator]");

    const versionOptions: UuidVersion[] = ["v4", "v6", "v7"];

    const { value: uuidVersion, updateValue: setUuidVersion } = useExtensionSetting<UuidVersion>({
        extensionId,
        key: "uuidVersion",
    });

    const { value: numberOfUuids, updateValue: setNumberOfUuids } = useExtensionSetting<number>({
        extensionId,
        key: "numberOfUuids",
    });

    const { value: uppercase, updateValue: setUppercase } = useExtensionSetting<boolean>({
        extensionId,
        key: "uppercase",
    });

    const { value: hyphens, updateValue: setHyphens } = useExtensionSetting<boolean>({
        extensionId,
        key: "hyphens",
    });

    const { value: braces, updateValue: setBraces } = useExtensionSetting<boolean>({
        extensionId,
        key: "braces",
    });

    const { value: quotes, updateValue: setQuotes } = useExtensionSetting<boolean>({
        extensionId,
        key: "quotes",
    });

    const { value: searchResultFormats, updateValue: setSearchResultFormats } = useExtensionSetting<UuidFormat[]>({
        extensionId,
        key: "searchResultFormats",
    });

    const addSearchResultFormat = () =>
        setSearchResultFormats(
            searchResultFormats.concat([{ uppercase: false, hyphens: false, braces: false, quotes: false }]),
        );

    const removeSearchResultFormat = (index: number) => {
        const newSearchResultFormats = searchResultFormats.filter((_, loopIndex) => loopIndex !== index);
        console.debug(newSearchResultFormats);
        setSearchResultFormats(newSearchResultFormats);
    };

    const setSearchResultFormatUppercase = (index: number, checked: boolean) => {
        searchResultFormats[index].uppercase = checked;
        setSearchResultFormats(searchResultFormats);
    };

    const setSearchResultFormatHypens = (index: number, checked: boolean) => {
        searchResultFormats[index].hyphens = checked;
        setSearchResultFormats(searchResultFormats);
    };

    const setSearchResultFormatBraces = (index: number, checked: boolean) => {
        searchResultFormats[index].braces = checked;
        setSearchResultFormats(searchResultFormats);
    };

    const setSearchResultFormatQuotes = (index: number, checked: boolean) => {
        searchResultFormats[index].quotes = checked;
        setSearchResultFormats(searchResultFormats);
    };

    return (
        <SettingGroupList>
            <SettingGroup title={t("extensionName")}>
                <Setting
                    label={t("uuidVersion")}
                    control={
                        <Dropdown
                            value={uuidVersion}
                            selectedOptions={[uuidVersion]}
                            onOptionSelect={(_, { optionValue }) => setUuidVersion(optionValue as UuidVersion)}
                        >
                            {versionOptions.map((versionName) => (
                                <Option key={versionName} value={versionName} text={versionName}>
                                    {versionName}
                                </Option>
                            ))}
                        </Dropdown>
                    }
                />
                <Setting
                    label={t("numberOfUuids")}
                    control={
                        <Input
                            value={`${numberOfUuids}`}
                            type="number"
                            onChange={(_, { value }) => value && setNumberOfUuids(Math.abs(Number(value)))}
                        />
                    }
                />
                <Setting
                    label={t("uppercase")}
                    control={
                        <Checkbox checked={uppercase} onChange={(_, { checked }) => setUppercase(checked === true)} />
                    }
                />
                <Setting
                    label={t("hyphens")}
                    control={<Checkbox checked={hyphens} onChange={(_, { checked }) => setHyphens(checked === true)} />}
                />
                <Setting
                    label={t("braces")}
                    control={<Checkbox checked={braces} onChange={(_, { checked }) => setBraces(checked === true)} />}
                />
                <Setting
                    label={t("quotes")}
                    control={<Checkbox checked={quotes} onChange={(_, { checked }) => setQuotes(checked === true)} />}
                />
                <div style={{ paddingTop: 8 }}>
                    <Label weight="semibold">{t("searchResultFormats")}</Label>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>{t("uppercase")}</TableHeaderCell>
                            <TableHeaderCell>{t("hyphens")}</TableHeaderCell>
                            <TableHeaderCell>{t("braces")}</TableHeaderCell>
                            <TableHeaderCell>{t("quotes")}</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {searchResultFormats.map(({ uppercase, hyphens, braces, quotes }, index) => (
                            <TableRow key={"row" + index}>
                                <TableCell>
                                    <Checkbox
                                        checked={uppercase}
                                        onChange={(_, { checked }) =>
                                            setSearchResultFormatUppercase(index, checked === true)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={hyphens}
                                        onChange={(_, { checked }) =>
                                            setSearchResultFormatHypens(index, checked === true)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={braces}
                                        onChange={(_, { checked }) =>
                                            setSearchResultFormatBraces(index, checked === true)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={quotes}
                                        onChange={(_, { checked }) =>
                                            setSearchResultFormatQuotes(index, checked === true)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    ></TableCellLayout>
                                    <TableCellActions>
                                        <Tooltip relationship="label" content={t("removeSearchResultFormat")}>
                                            <Button
                                                style={{ marginLeft: 4 }}
                                                size="small"
                                                icon={<DismissRegular />}
                                                onClick={() => removeSearchResultFormat(index)}
                                            />
                                        </Tooltip>
                                    </TableCellActions>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                    <DialogTrigger disableButtonEnhancement>
                        <Button onClick={() => addSearchResultFormat()} icon={<AddRegular />}>
                            {t("addSearchResultFormat")}
                        </Button>
                    </DialogTrigger>
                </div>
            </SettingGroup>
        </SettingGroupList>
    );
};
