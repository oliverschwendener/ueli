import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";

export class MacOsSystemCommand implements SystemCommand {
    public constructor(
        private readonly name: string,
        private readonly description: string,
        private readonly command: string,
        private readonly image: Image,
        private readonly hideWindowAfterInvocation?: boolean,
        private readonly requiresConfirmation?: boolean,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            defaultAction: {
                argument: this.command,
                description: this.description,
                handlerId: "MacOsSystemCommandActionHandler",
                hideWindowAfterInvocation: this.hideWindowAfterInvocation,
                requiresConfirmation: this.requiresConfirmation,
            },
            description: this.description,
            id: `SystemCommand[${Buffer.from(`${this.name}${this.command}`).toString("hex")}]`,
            image: this.image,
            name: this.name,
        };
    }
}
