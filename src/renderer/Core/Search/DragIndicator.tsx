import { Tooltip } from "@fluentui/react-components";
import { ProtocolHandlerRegular } from "@fluentui/react-icons";

export const DragIndicator = () => {
    // TODO: add translations

    return (
        <Tooltip content="Can be dragged" relationship="label">
            <ProtocolHandlerRegular />
        </Tooltip>
    );
};
