import { useExtensionSetting } from "@Core/Hooks";
import { Section } from "@Core/Settings/Section";
import { SectionList } from "@Core/Settings/SectionList";
import type { Workflow } from "@common/Extensions/Workflow";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@fluentui/react-components";
import { AddWorkflow } from "./AddWorkflow";

export const WorkflowSettings = () => {
    const { value: workflows, updateValue: setWorkflows } = useExtensionSetting<Workflow[]>({
        extensionId: "Workflow",
        key: "workflows",
    });

    const addWorkflow = (workflow: Workflow) => setWorkflows([...workflows, workflow]);

    return (
        <SectionList>
            <Section>
                <AddWorkflow add={addWorkflow} />
            </Section>
            <Section>
                <Accordion collapsible multiple>
                    {workflows.map((workflow) => {
                        return (
                            <AccordionItem value={workflow.id}>
                                <AccordionHeader>{workflow.name}</AccordionHeader>
                                <AccordionPanel>
                                    {workflow.actions.map((action) => (
                                        <div>{action.name}</div>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Section>
        </SectionList>
    );
};
