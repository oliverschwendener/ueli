import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowExtension implements Extension {
    public readonly id = "Workflow";

    public readonly name = "Workflow";

    // TODO: public readonly nameTranslation?: { key: string; namespace: string };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly workflowRepository: WorkflowRepository,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const workflows = await this.workflowRepository.getAll();
        return workflows.map((w) => w.toSearchResultItem(this.getImage()));
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "workflow.png")}`,
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {};
    }
}
