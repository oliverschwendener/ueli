import { Icon } from "../../../common/icon/icon";

export interface OperatingSystemCommand {
    name: string;
    description: string;
    executionArgument: string;
    icon: Icon;
    searchable: string[];
}
