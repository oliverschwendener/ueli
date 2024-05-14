import { Menu, type MenuItemConstructorOptions } from "electron";

export class ContextMenuBuilder {
    public buildFromTemplate(template: MenuItemConstructorOptions[]) {
        return Menu.buildFromTemplate(template);
    }
}
