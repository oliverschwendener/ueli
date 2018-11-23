import { ProductionIcon } from "./production-icon";

export class ProductionIconStore {
    private readonly icons: ProductionIcon[] = [];

    public addIcon(icon: ProductionIcon) {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ProductionIcon | undefined {
        const foundIcon = this.icons.find((icon: ProductionIcon) => icon.name === iconName);

        return foundIcon !== undefined
            ? foundIcon
            : undefined;
    }
}
