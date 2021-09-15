import SimpleComponent from "../core/SimpleComponent.js";
import CopyStateChangeHandler from "../../app/components/state-change-handlers/CopyStateChangeHandler.js";
import ComponentConfigurer from "../core/ComponentConfigurer.js";

/**
 * @param {AbstractComponent} component
 * @param {Object=} debuggerOptions
 * @param {string=} debuggerOptions.debuggerElemIdOrJQuery
 * @param {string=} debuggerOptions.initialDebuggerMessage
 * @param {boolean=} debuggerOptions.showAsJson
 */
export function withDebugger(component, debuggerOptions) {
    const debuggerStateChangeHandler = createDebuggerStateChangeHandler(debuggerOptions);
    component.stateChangesHandlerAdapter.stateChangesHandlers.push(debuggerStateChangeHandler);
    return component;
}

/**
 * @param {Object=} debuggerOptions
 * @param {boolean=} debuggerOptions.showAsJson
 * @param {string=} debuggerOptions.debuggerElemIdOrJQuery
 * @param {string=} debuggerOptions.initialDebuggerMessage
 */
export function createDebuggerConfiguration(debuggerOptions) {
    return {configurer: createDebuggerComponentConfigurer(debuggerOptions)}
}

/**
 * @param {Object=} debuggerOptions
 * @param {boolean=} debuggerOptions.showAsJson
 * @param {string=} debuggerOptions.debuggerElemIdOrJQuery
 * @param {string=} debuggerOptions.initialDebuggerMessage
 */
export function createDebuggerComponentConfigurer(debuggerOptions) {
    const debuggerStateChangeHandler = createDebuggerStateChangeHandler(debuggerOptions);
    return new DebuggerComponentConfigurer(debuggerStateChangeHandler);
}

/**
 * @param {Object=} debuggerOptions
 * @param {boolean=} debuggerOptions.showAsJson
 * @param {string=} debuggerOptions.debuggerElemIdOrJQuery
 * @param {string=} debuggerOptions.initialDebuggerMessage
 */
function createDebuggerStateChangeHandler({showAsJson, debuggerElemIdOrJQuery, initialDebuggerMessage} = {}) {
    showAsJson = showAsJson ?? true;
    debuggerElemIdOrJQuery = debuggerElemIdOrJQuery ?? "debugger";
    initialDebuggerMessage = initialDebuggerMessage ?? "state debugger";
    const simpleDebugger = new SimpleComponent({
        elemIdOrJQuery: debuggerElemIdOrJQuery,
        initialState: initialDebuggerMessage
    }).render();
    return new CopyStateChangeHandler(simpleDebugger, showAsJson);
}

class DebuggerComponentConfigurer extends ComponentConfigurer {
    debuggerStateChangeHandler;

    constructor(debuggerStateChangeHandler) {
        super();
        this.debuggerStateChangeHandler = debuggerStateChangeHandler;
    }

    configureStateChangesHandlerAdapter(stateChangesHandlerAdapter) {
        stateChangesHandlerAdapter.appendStateChangesHandler(this.debuggerStateChangeHandler);
    }
}