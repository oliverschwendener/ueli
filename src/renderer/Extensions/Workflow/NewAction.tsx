import { OperatingSystem } from "@common/Core";
import type { WorkflowAction } from "@common/Extensions/Workflow";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Body1Strong,
    Button,
    Dropdown,
    Field,
    Option,
} from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NewActionExecuteCommand } from "./NewActionExecuteCommand";
import { NewActionName } from "./NewActionName";
import { NewActionOpenFile } from "./NewActionOpenFile";
import { NewActionOpenTerminal } from "./NewActionOpenTerminal";
import { NewActionOpenUrl } from "./NewActionOpenUrl";

const defaultTerminalIds: Record<OperatingSystem, string> = {
    Linux: "",
    macOS: "Terminal",
    Windows: "Command Prompt",
};

const generateNewAction = (): WorkflowAction<unknown> => {
    return {
        id: `workflow-action-${crypto.randomUUID()}`,
        args: {
            filePath: "",
            url: "",
            command: "",
            terminalId: defaultTerminalIds[window.ContextBridge.getOperatingSystem()],
        },
        name: "",
        handlerId: "OpenFile",
    };
};

type NewActionProps = {
    add: (action: WorkflowAction<unknown>) => void;
};

export const NewAction = ({ add }: NewActionProps) => {
    const { t } = useTranslation("extension[Workflow]");

    const [newAction, setNewAction] = useState<WorkflowAction<unknown>>(generateNewAction());

    const setNewActionHandlerId = (handlerId: string) => setNewAction({ ...newAction, handlerId });

    const setNewActionName = (name: string) => setNewAction({ ...newAction, name });

    const setNewActionArgs = (args: unknown) => setNewAction({ ...newAction, args });

    const handlerIds = ["OpenFile", "OpenUrl", "OpenTerminal", "ExecuteCommand"];

    return (
        <Accordion collapsible>
            <AccordionItem value="newAction">
                <AccordionHeader>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Body1Strong>{t("newAction")}</Body1Strong>
                    </div>
                </AccordionHeader>
                <AccordionPanel>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        <NewActionName name={newAction.name} setName={setNewActionName} />

                        <Field label={t("type")}>
                            <Dropdown
                                value={t(`type.${newAction.handlerId}`)}
                                selectedOptions={[newAction.handlerId]}
                                onOptionSelect={(_, { optionValue }) =>
                                    optionValue && setNewActionHandlerId(optionValue)
                                }
                                size="small"
                            >
                                {handlerIds.map((handlerId) => (
                                    <Option key={handlerId} value={handlerId}>
                                        {t(`type.${handlerId}`)}
                                    </Option>
                                ))}
                            </Dropdown>
                        </Field>

                        {newAction.handlerId === "OpenFile" && (
                            <NewActionOpenFile args={newAction.args} setArgs={setNewActionArgs} />
                        )}

                        {newAction.handlerId === "OpenUrl" && (
                            <NewActionOpenUrl args={newAction.args} setArgs={setNewActionArgs} />
                        )}

                        {newAction.handlerId === "OpenTerminal" && (
                            <NewActionOpenTerminal args={newAction.args} setArgs={setNewActionArgs} />
                        )}

                        {newAction.handlerId === "ExecuteCommand" && (
                            <NewActionExecuteCommand args={newAction.args} setArgs={setNewActionArgs} />
                        )}

                        <div>
                            <Button
                                size="small"
                                icon={<AddRegular fontSize={14} />}
                                onClick={() => {
                                    add(newAction);
                                    setNewAction(generateNewAction());
                                }}
                            >
                                {t("addAction")}
                            </Button>
                        </div>
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
