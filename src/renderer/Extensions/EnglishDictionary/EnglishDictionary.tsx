import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { ProgressBar, Textarea } from "@fluentui/react-components";
import { getImageUrl } from "@Core/getImageUrl";
import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftFilled, CopyRegular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";



type InvocationArgument = {
    word: string;
};

interface InvocationResult {
    word: string;
    phonetic: string;
    phonetics: { text: string; audio: string }[];
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
        }[];
        synonyms?: string[];
        antonyms?: string[];
    }[],
}


export const EnglishDictionary = ({ contextBridge, goBack }: ExtensionProps) => {
    const extensionId = "EnglishDictionary";
    const { t } = useTranslation();
    const ns = "extension[EnglishDictionary]";

    const [definition, setDefinition] = useState<string>("");
    const [definitionPayload, setDefinitionPayload] = useState<InvocationResult | null>(null);
    const [userInput, setUserInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(userInput.length > 0);
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const searchForDefinition = async (searchTerm: string) => {
        if (!searchTerm.trim().length) {
            setIsLoading(false);
            setDefinition("");
            setDefinitionPayload(null);
         
            return;
        }

        try {
            const definitionResponse = await contextBridge.invokeExtension<InvocationArgument, InvocationResult>(
                extensionId,
                { word: searchTerm },
            );

            setDefinition(definitionResponse.meanings[0].definitions[0].definition);
            setDefinitionPayload(definitionResponse);
        } catch (error) {
            setDefinition("");
            setDefinitionPayload(null);
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
                await searchForDefinition(userInput);
            }, 250),
        );


    }, [userInput]);



    return (
        <BaseLayout
            header={
                <Header
                    draggable
                    contentBefore={
                        <Button
                            size="small"
                            appearance="subtle"
                            className="non-draggable-area"
                            onClick={goBack}
                            icon={<ArrowLeftFilled fontSize={14} />}
                        ></Button>
                    }
                >
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 10 }}
                    >
                        <img
                            alt="English Dictionary Logo"
                            src={getImageUrl({
                                image: contextBridge.getExtension(extensionId).image,
                                shouldPreferDarkColors: contextBridge.themeShouldUseDarkColors(),
                            })}
                            style={{ width: 24 }}
                        />
                        <div style={{ flexGrow: 1 }}>
                            <Text weight="semibold">{t("extensionName", { ns })} </Text>
                        </div>

                    </div>
                </Header>
            }
            content={
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
                    <Textarea
                        autoFocus
                        style={{ width: "100%", height: "auto" }}
                        placeholder="Type to define..."
                        value={userInput}
                        onChange={(_, { value }) => setUserInput(value)}
                    />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 10,
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "bold",
                                   
                                }}
                            >{definitionPayload?.word}</span>
                            <span
                                style={{
                                    fontStyle: "italic",
                                    marginTop: 5
                                }}
                            >{definitionPayload?.phonetics.find((phonetic) => phonetic.text)?.text}</span>
                            <span>{definitionPayload?.meanings[0].definitions[0].definition} </span>
                        </div>

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
            }
            footer={

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        padding: 10,
                        boxSizing: "border-box",
                    }}
                >
                 
                    <Button
                        disabled={definition.length === 0}
                        appearance="subtle"
                        icon={<CopyRegular />}
                        iconPosition="after"
                        onClick={() => contextBridge.copyTextToClipboard(definition)}
                    >
                        Copy definition text
                    </Button>
                </div>

            }
        />
    );
};
