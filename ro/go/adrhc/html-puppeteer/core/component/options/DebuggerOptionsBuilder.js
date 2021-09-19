import {AbstractComponentOptionsBuilder} from "./AbstractComponentOptionsBuilder.js";
import SimpleComponent from "../SimpleComponent.js";
import CopyStatesChangeHandler from "../../state-changes-handler/CopyStatesChangeHandler.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {boolean=} showAsJson
 * @property {string} [debuggerElemIdOrJQuery="debugger"]
 * @property {string=} initialDebuggerMessage
 */
export default class DebuggerOptionsBuilder extends AbstractComponentOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {DebuggerOptionsBuilder}
     */
    addDebugger(debuggerOptions = {}) {
        const debuggerStateChangeHandler = this._createDebuggerStateChangeHandler(debuggerOptions);
        return this.addStateChangeHandler(debuggerStateChangeHandler);
    }

    /**
     * @param {Object=} debuggerOptions
     * @param {boolean=} debuggerOptions.showAsJson
     * @param {string=} debuggerOptions.debuggerElemIdOrJQuery
     * @param {string=} debuggerOptions.initialDebuggerMessage
     * @return {CopyStatesChangeHandler}
     * @protected
     */
    _createDebuggerStateChangeHandler({showAsJson, debuggerElemIdOrJQuery, initialDebuggerMessage} = {}) {
        showAsJson = showAsJson ?? true;
        debuggerElemIdOrJQuery = debuggerElemIdOrJQuery ?? "debugger";
        initialDebuggerMessage = initialDebuggerMessage ?? "state debugger";
        const simpleDebugger = new SimpleComponent({
            elemIdOrJQuery: debuggerElemIdOrJQuery,
            initialState: initialDebuggerMessage
        }).render();
        return new CopyStatesChangeHandler(simpleDebugger, showAsJson);
    }
}

/**
 * creates options with a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
 *
 * @param {DebuggerOptions=} debuggerOptions
 * @return {AbstractComponentOptions}
 */
export function withDebugger(debuggerOptions) {
    return addDebugger(debuggerOptions).options();
}

/**
 * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
 *
 * @param {DebuggerOptions=} debuggerOptions
 * @return {DebuggerOptionsBuilder}
 */
export function addDebugger(debuggerOptions = {}) {
    return new DebuggerOptionsBuilder().addDebugger(debuggerOptions);
}
