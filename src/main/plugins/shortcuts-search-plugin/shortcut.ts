import { ShortcutType } from "./shortcut-type";
import { Icon } from "../../../common/icon/icon";

export interface Shortcut {
    name: string;
    description: string;
    executionArgument: string;
    icon: Icon;
    tags: string[];
    type: ShortcutType;
}
