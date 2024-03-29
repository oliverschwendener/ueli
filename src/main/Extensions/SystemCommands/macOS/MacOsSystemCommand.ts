import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";

export class MacOsSystemCommand implements SystemCommand {
    public static create({
        name,
        description,
        appleScript,
        image,
        hideWindowAfterInvocation,
        requiresConfirmation,
    }: {
        name: string;
        description: string;
        appleScript: string;
        image: Image;
        hideWindowAfterInvocation?: boolean;
        requiresConfirmation?: boolean;
    }): MacOsSystemCommand {
        return new MacOsSystemCommand(
            name,
            description,
            appleScript,
            image,
            hideWindowAfterInvocation,
            requiresConfirmation,
        );
    }

    private constructor(
        private readonly name: string,
        private readonly description: string,
        private readonly appleScript: string,
        private readonly image: Image,
        private readonly hideWindowAfterInvocation?: boolean,
        private readonly requiresConfirmation?: boolean,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            defaultAction: {
                argument: this.appleScript,
                description: this.description,
                handlerId: "MacOsSystemCommandActionHandler",
                hideWindowAfterInvocation: this.hideWindowAfterInvocation,
                requiresConfirmation: this.requiresConfirmation,
            },
            description: this.description,
            id: `SystemCommand[${Buffer.from(`${this.name}${this.appleScript}`).toString("hex")}]`,
            image: this.image,
            name: this.name,
        };
    }
}
