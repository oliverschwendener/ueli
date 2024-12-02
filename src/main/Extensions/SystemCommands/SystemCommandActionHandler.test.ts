import type { SearchResultItem, SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { SystemCommandActionHandler } from "./SystemCommandActionHandler";
import type { SystemCommandRepository } from "./SystemCommandRepository";

describe(SystemCommandActionHandler, () => {
    describe(SystemCommandActionHandler.prototype.id, () => {
        it("should be 'SystemCommandActionHandler'", () => {
            expect(new SystemCommandActionHandler(<SystemCommandRepository>{}).id).toBe("SystemCommandActionHandler");
        });
    });

    describe(SystemCommandActionHandler.prototype.invokeAction, () => {
        it("should invoke the system command if found", async () => {
            const invokeMock = vi.fn();

            const repo = <SystemCommandRepository>{
                getAll: async () => [
                    {
                        getId: () => "id1",
                        invoke: async () => null,
                        toSearchResultItem: () => <SearchResultItem>{},
                    },
                    {
                        getId: () => "id2",
                        invoke: async () => invokeMock(),
                        toSearchResultItem: () => <SearchResultItem>{},
                    },
                    {
                        getId: () => "id3",
                        invoke: async () => null,
                        toSearchResultItem: () => <SearchResultItem>{},
                    },
                ],
            };

            const systemCommandActionHandler = new SystemCommandActionHandler(repo);

            await systemCommandActionHandler.invokeAction(<SearchResultItemAction>{ argument: "id2" });

            expect(invokeMock).toHaveBeenCalledOnce();
        });

        it("should throw an error if the system command is not found", async () => {
            const repo = <SystemCommandRepository>{
                getAll: async () => [],
            };

            const systemCommandActionHandler = new SystemCommandActionHandler(repo);

            await expect(async () => {
                await systemCommandActionHandler.invokeAction(<SearchResultItemAction>{ argument: "id" });
            }).rejects.toThrowError('System command with id "id" not found');
        });
    });
});
