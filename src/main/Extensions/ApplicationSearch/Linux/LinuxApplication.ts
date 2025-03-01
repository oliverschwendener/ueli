import type { SearchResultItem } from "@common/Core";
import { createCopyToClipboardAction, createShowItemInFileExplorerAction } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Application } from "../Application";
import { createLaunchDesktopFileAction } from "./createLaunchDesktopFileAction";

export class LinuxApplication implements Application {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly image: Image,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            description: "Application",
            descriptionTranslation: {
                key: "searchResultItemDescription",
                namespace: "extension[ApplicationSearch]",
            },
            details: this.filePath,
            id: this.getId(),
            name: this.name,
            image: this.image,
            defaultAction: createLaunchDesktopFileAction({
                filePath: this.filePath,
                description: "Open application",
                descriptionTranslation: {
                    key: "openApplication",
                    namespace: "extension[ApplicationSearch]",
                },
            }),
            additionalActions: [
                createShowItemInFileExplorerAction({ filePath: this.filePath, keyboardShortcut: "Ctrl+O" }),
                createCopyToClipboardAction({
                    textToCopy: this.filePath,
                    description: "Copy file path to clipboard",
                    descriptionTranslation: {
                        key: "copyFilePathToClipboard",
                        namespace: "extension[ApplicationSearch]",
                    },
                    keyboardShortcut: "Ctrl+C",
                }),
            ],
        };
    }

    public getId(): string {
        return Buffer.from(`[LinuxApplication][${this.filePath}]`).toString("base64");
    }
}
