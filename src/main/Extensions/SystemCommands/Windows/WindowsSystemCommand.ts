import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";

export class WindowsSystemCommand implements SystemCommand {
    public static create({
        name,
        description,
        command,
        image,
        requiresConfirmation,
    }: {
        name: string;
        description: string;
        command: string;
        image: Image;
        requiresConfirmation?: boolean;
    }): WindowsSystemCommand {
        return new WindowsSystemCommand(name, description, command, image, requiresConfirmation);
    }

    private constructor(
        private readonly name: string,
        private readonly description: string,
        private readonly command: string,
        private readonly image: Image,
        private readonly requiresConfirmation?: boolean,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            defaultAction: {
                argument: this.command,
                description: this.description,
                handlerId: "WindowsSystemCommandActionHandler",
                requiresConfirmation: this.requiresConfirmation,
            },
            description: this.description,
            id: `SystemCommand[${Buffer.from(`${this.name}${this.command}`).toString("hex")}]`,
            image: this.image,
            name: this.name,
        };
    }
}
