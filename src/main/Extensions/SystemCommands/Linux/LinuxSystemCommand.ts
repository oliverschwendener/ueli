import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";

export class LinuxSystemCommand implements SystemCommand {
    public static create({
        name,
        description,
        details,
        image,
        invoke,
    }: {
        name: string;
        description: string;
        details: string;
        image: Image;
        invoke: () => Promise<void>;
    }): LinuxSystemCommand {
        return new LinuxSystemCommand(name, description, details, image, invoke);
    }

    private constructor(
        private readonly name: string,
        private readonly description: string,
        private readonly details: string,
        private readonly image: Image,
        public readonly invoke: () => Promise<void>,
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
                requiresConfirmation: true,
                hideWindowAfterInvocation: true,
            },
            description: this.description,
            details: this.details,
            id: this.getId(),
            image: this.image,
            name: this.name,
        };
    }
}
