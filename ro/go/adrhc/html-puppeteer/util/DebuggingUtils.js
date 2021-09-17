import SimpleComponent from "../core/SimpleComponent.js";
import CopyStateChangeHandler from "../core/CopyStateChangeHandler.js";
import {withStateChangesHandlerAdapterConfiguratorOf} from "../core/ComponentConfigurator.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {boolean=} showAsJson
 * @property {string=} debuggerElemIdOrJQuery
 * @property {string=} initialDebuggerMessage*
 */

/**
 * @param {AbstractComponentOptionsWithConfigurator & DebuggerOptions | {}} debuggerAndComponentOptions
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withDebugger(debuggerAndComponentOptions = {}) {
    const debuggerStateChangeHandler = createDebuggerStateChangeHandler(debuggerAndComponentOptions);
    return withStateChangesHandlerAdapterConfiguratorOf(debuggerAndComponentOptions,
        (scha) => {
            scha.appendStateChangesHandler(debuggerStateChangeHandler);
        });
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
