import SimpleComponent from "../core/SimpleComponent.js";
import CopyStateChangeHandler from "../../app/components/state-change-handlers/CopyStateChangeHandler.js";

/**
 * @param {AbstractComponent} component
 * @param {Object=} componentOptions
 * @param {string=} componentOptions.debuggerElemIdOrJQuery
 * @param {string=} componentOptions.initialDebuggerMessage
 * @param {boolean=} componentOptions.showAsJson
 */
export function withDebugger(component, componentOptions) {
    const debuggerStateChangeHandler = createDebuggerStateChangeHandler(componentOptions);
    component.stateChangesHandlerAdapter.stateChangesHandlers.push(debuggerStateChangeHandler);
    return component;
}

export function createDebuggerStateChangeHandler({showAsJson, debuggerElemIdOrJQuery, initialDebuggerMessage} = {}) {
    showAsJson = showAsJson ?? true;
    debuggerElemIdOrJQuery = debuggerElemIdOrJQuery ?? "debugger";
    initialDebuggerMessage = initialDebuggerMessage ?? "state debugger";
    const simpleDebugger = new SimpleComponent({
        elemIdOrJQuery: debuggerElemIdOrJQuery,
        initialState: initialDebuggerMessage
    }).render();
    return new CopyStateChangeHandler(simpleDebugger, showAsJson);
}