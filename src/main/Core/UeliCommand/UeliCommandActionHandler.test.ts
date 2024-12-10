import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import type { UeliCommandInvoker } from "./Contract";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";

describe(UeliCommandActionHandler, () => {
    it("should invoke an ueli command", async () => {
        const invokeUeliCommandMock = vi.fn();
        const ueliCommandInvoker = <UeliCommandInvoker>{ invokeUeliCommand: (u) => invokeUeliCommandMock(u) };
        const ueliCommandActionHandler = new UeliCommandActionHandler(ueliCommandInvoker);

        await ueliCommandActionHandler.invokeAction(<SearchResultItemAction>{ argument: "test ueli command" });

        expect(invokeUeliCommandMock).toHaveBeenCalledWith("test ueli command");
    });
});
