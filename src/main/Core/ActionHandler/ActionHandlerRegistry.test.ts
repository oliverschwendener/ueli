import { describe, expect, it } from "vitest";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";
import type { ActionHandler } from "./Contract";

describe(ActionHandlerRegistry, () => {
    it("should be able to add new action handlers", () => {
        const actionHandlerRegistry = new ActionHandlerRegistry();

        const actionHandler = <ActionHandler>{ id: "id1" };

        actionHandlerRegistry.register(actionHandler);

        expect(actionHandlerRegistry.getAll()).toEqual([actionHandler]);
    });

    it("should throw an error when trying to register an extension twice", () => {
        const actionHandlerRegistry = new ActionHandlerRegistry();

        const actionHandler = <ActionHandler>{ id: "id1" };

        expect(() => {
            actionHandlerRegistry.register(actionHandler);
            actionHandlerRegistry.register(actionHandler);
        }).toThrowError(`Action handler with id "${actionHandler.id}" is already registered`);
    });

    it("should get an extension by id", () => {
        const actionHandlerRegistry = new ActionHandlerRegistry();
        const actionHandler = <ActionHandler>{ id: "id1" };

        actionHandlerRegistry.register(actionHandler);

        expect(actionHandlerRegistry.getById(actionHandler.id)).toBe(actionHandler);
    });

    it("should throw an error when action handler can't be found", () => {
        const actionHandlerRegistry = new ActionHandlerRegistry();
        expect(() => {
            actionHandlerRegistry.getById("id1");
        }).toThrowError(`Action handler with id "id1" can't be found`);
    });

    it("should get all action handlers", () => {
        const actionHandlerRegistry = new ActionHandlerRegistry();

        const actionHandler1 = <ActionHandler>{ id: "id1" };
        const actionHandler2 = <ActionHandler>{ id: "id2" };

        actionHandlerRegistry.register(actionHandler1);
        actionHandlerRegistry.register(actionHandler2);

        expect(actionHandlerRegistry.getAll()).toEqual([actionHandler1, actionHandler2]);
    });
});
