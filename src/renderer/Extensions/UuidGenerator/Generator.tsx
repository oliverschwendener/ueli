import { useExtensionSetting } from "@Core/Hooks";
import type { ContextBridge } from "@common/Core";
import type { UuidGeneratorSetting, UuidVersion } from "@common/Extensions/UuidGenerator";
import { Checkbox, Dropdown, Input, Label, Option, ProgressBar, Textarea } from "@fluentui/react-components";
import { useEffect, useState } from "react";

type GeneratorProps = {
    generatedUuids: string;
    setGeneratedUuids: (text: string) => void;
    uuidVersionLabel: string;
    numberOfUuidsLabel: string;
    uppercaseLabel: string;
    hyphensLabel: string;
    bracesLabel: string;
    quotesLabel: string;
    contextBridge: ContextBridge;
};

type InvocationResult = string[];

export const Generator = ({
    generatedUuids,
    setGeneratedUuids,
    uuidVersionLabel,
    numberOfUuidsLabel,
    uppercaseLabel,
    hyphensLabel,
    bracesLabel,
    quotesLabel,
    contextBridge,
}: GeneratorProps) => {
    const extensionId = "UuidGenerator";
    const versionOptions: UuidVersion[] = ["v4", "v6", "v7"];

    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const generate = async () => {
        try {
            const uuids = await contextBridge.invokeExtension<UuidGeneratorSetting, InvocationResult>(extensionId, {
                uuidVersion,
                numberOfUuids,
                uppercase,
                hyphens,
                braces,
                quotes,
            });

            setGeneratedUuids(uuids.join("\n"));
        } catch (error) {
            setGeneratedUuids("");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);

        if (clearTimeoutValue) {
            clearTimeout(clearTimeoutValue);
        }

        setClearTimeoutValue(
            setTimeout(async () => {
                setClearTimeoutValue(undefined);
                await generate();
            }, 250),
        );
    }, [uuidVersion, numberOfUuids, uppercase, hyphens, braces, quotes]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                boxSizing: "border-box",
                gap: 10,
                height: "100%",
            }}
        >
            <div style={{ display: "flex", flexDirection: "row", gap: 10, flexGrow: 1 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Label style={{ padding: 5 }}>{uuidVersionLabel}</Label>
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
                    <Checkbox
                        label={uppercaseLabel}
                        checked={uppercase}
                        onChange={(_, { checked }) => setUppercase(checked === true)}
                    />
                    <Checkbox
                        label={hyphensLabel}
                        checked={hyphens}
                        onChange={(_, { checked }) => setHyphens(checked === true)}
                    />
                </div>
                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Label style={{ padding: 5 }}>{numberOfUuidsLabel}</Label>
                    <Input
                        type="number"
                        value={`${numberOfUuids}`}
                        onChange={(_, { value }) => value && setNumberOfUuids(Math.abs(Number(value)))}
                    />
                    <Checkbox
                        label={bracesLabel}
                        checked={braces}
                        onChange={(_, { checked }) => setBraces(checked === true)}
                    />
                    <Checkbox
                        label={quotesLabel}
                        checked={quotes}
                        onChange={(_, { checked }) => setQuotes(checked === true)}
                    />
                </div>
            </div>
            <div
                style={{
                    minHeight: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Textarea
                    readOnly
                    style={{ flexGrow: 1, width: "100%", height: "100%" }}
                    placeholder="UUIDs will appear here"
                    value={generatedUuids}
                />
            </div>
            <div
                style={{
                    minHeight: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {isLoading ? <ProgressBar /> : null}
            </div>
        </div>
    );
};
