import SimpleComponent from "../core/SimpleComponent.js";
import CopyStateChangeHandler from "../../app/components/state-change-handlers/CopyStateChangeHandler.js";
import ComponentConfigurator from "../core/ComponentConfigurator.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {boolean=} showAsJson
 * @property {string=} debuggerElemIdOrJQuery
 * @property {string=} initialDebuggerMessage*
 */

/**
 * @param {AbstractComponentOptionsWithConfigurator & DebuggerOptions} debuggerAndComponentOptions
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withDebuggerConfigurator(debuggerAndComponentOptions = {}) {
    debuggerAndComponentOptions.extraConfigurators = debuggerAndComponentOptions.extraConfigurators ?? [];
    debuggerAndComponentOptions.extraConfigurators.push(createDebuggerComponentConfigurator(debuggerAndComponentOptions))
    return debuggerAndComponentOptions;
}

/**
 * @param {DebuggerOptions=} options
 * @return {DebuggerComponentConfigurator}
 */
export function createDebuggerComponentConfigurator(options) {
    const debuggerStateChangeHandler = createDebuggerStateChangeHandler(options);
    return new DebuggerComponentConfigurator(debuggerStateChangeHandler);
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

class DebuggerComponentConfigurator extends ComponentConfigurator {
    debuggerStateChangeHandler;

    /**
     * @param {StateChangesHandler} debuggerStateChangeHandler
     */
    constructor(debuggerStateChangeHandler) {
        super();
        this.debuggerStateChangeHandler = debuggerStateChangeHandler;
    }

    _configureStateChangesHandlerAdapter(stateChangesHandlerAdapter) {
        stateChangesHandlerAdapter.appendStateChangesHandler(this.debuggerStateChangeHandler);
    }
}