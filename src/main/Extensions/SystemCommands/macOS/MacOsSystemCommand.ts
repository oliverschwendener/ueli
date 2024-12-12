import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";

export class MacOsSystemCommand implements SystemCommand {
    public static create({
        name,
        description,
        image,
        invoke,
        requiresConfirmation,
    }: {
        name: string;
        description: string;
        image: Image;
        invoke: () => Promise<void>;
        requiresConfirmation?: boolean;
    }): MacOsSystemCommand {
        return new MacOsSystemCommand(name, description, image, invoke, requiresConfirmation);
    }

    private constructor(
        private readonly name: string,
        private readonly description: string,
        private readonly image: Image,
        public readonly invoke: () => Promise<void>,
        private readonly requiresConfirmation?: boolean,
    ) {}

    public getId(): string {
        return `SystemCommand[${Buffer.from(`${this.name}`).toString("hex")}]`;
    }

    public toSearchResultItem(): SearchResultItem {
        return {
            defaultAction: {
                argument: this.getId(),
                description: this.description,
                handlerId: "SystemCommandActionHandler",
                requiresConfirmation: this.requiresConfirmation,
                hideWindowAfterInvocation: true,
            },
            description: this.description,
            id: this.getId(),
            image: this.image,
            name: this.name,
        };
    }
}
