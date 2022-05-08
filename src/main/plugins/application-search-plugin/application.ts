import { Icon } from "../../../common/icon/icon";

export interface Application {
    name: string;
    nativeName?: string;
    keyword?: string[];
    filePath: string;
    icon: Icon;
}
