import type { FluentIcon as FluentIconString } from "@common/FluentIcon";
import * as FluentIcons from "@fluentui/react-icons";

type FluentIconProps = {
    icon: FluentIconString;
};

export const FluentIcon = ({ icon }: FluentIconProps) => {
    const FluentIcon = FluentIcons[icon];
    return <FluentIcon />;
};
