import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { Workflow } from "@common/Extensions/Workflow";
import { WorkflowActionArgumentEncoder } from "./Utility";
import { WorkflowRepository } from "./WorkflowRepository";

export class WorkflowExtension implements Extension {
    public readonly id = "Workflow";

    public readonly name = "Workflow";

    // TODO: public readonly nameTranslation?: { key: string; namespace: string };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings = {
        workflows: <Workflow[]>[],
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly workflowRepository: WorkflowRepository,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const workflows = await this.workflowRepository.getAll();
        return workflows.map((workflow) => this.workflowToSearchResultItem(workflow));
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key): T {
        return this.defaultSettings[key] as T;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "workflow.png")}`,
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {};
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "workflows")];
    }

    private workflowToSearchResultItem(workflow: Workflow): SearchResultItem {
        return {
            defaultAction: {
                argument: WorkflowActionArgumentEncoder.encodeArgument(workflow.actions),
                description: "Invoke workflow",
                handlerId: "Workflow",
            },
            description: "Workflow",
            id: workflow.id,
            image: this.getImage(),
            name: workflow.name,
        };
    }
}
