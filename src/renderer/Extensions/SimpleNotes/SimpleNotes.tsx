import { BaseLayout } from "@Core/BaseLayout";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { Header } from "@Core/Header";
import { Button, Input, Text, ToggleButton, tokens, Tooltip } from "@fluentui/react-components";
import { ArrowLeft16Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";

export const SimpleNotes = ({ goBack }: ExtensionProps) => {
    const titleRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [mode, setMode] = useState<"editor" | "preview">("editor");

    const toggleMode = () => {
        setMode(mode === "editor" ? "preview" : "editor");
    };

    useEffect(() => {
        const focusAndSelectTitle = () => {
            titleRef.current?.focus();
        };

        focusAndSelectTitle();
    }, []);

    return (
        <BaseLayout
            header={
                <Header
                    draggable
                    contentBefore={
                        <Tooltip relationship="label" content="Go back">
                            <Button
                                className="non-draggable-area"
                                size="small"
                                icon={<ArrowLeft16Regular />}
                                onClick={() => goBack()}
                            />
                        </Tooltip>
                    }
                >
                    <div style={{ flexGrow: 1 }} className="non-draggable-area">
                        <Input
                            style={{ width: "100%" }}
                            ref={titleRef}
                            placeholder="Add title for your note here..."
                            value={title}
                            onChange={(_, { value }) => setTitle(value)}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 10 }} className="non-draggable-area">
                        <ToggleButton size="small" checked={mode === "editor"} onClick={toggleMode}>
                            Editor
                        </ToggleButton>
                        <ToggleButton size="small" checked={mode === "preview"} onClick={toggleMode}>
                            Preview
                        </ToggleButton>
                    </div>
                </Header>
            }
            content={
                <div
                    style={{
                        padding: 10,
                        height: "100%",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    {mode === "editor" && (
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            style={{
                                width: "100%",
                                flexGrow: 1,
                                flexShrink: 0,
                                fontFamily: tokens.fontFamilyMonospace,
                            }}
                        />
                    )}

                    {mode === "preview" && (
                        <div style={{ flexGrow: 1, flexShrink: 0 }}>
                            <Text>{note}</Text>
                        </div>
                    )}
                </div>
            }
        />
    );
};
