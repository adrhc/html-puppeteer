import {AbstractComponentOptionsBuilder} from "./AbstractComponentOptionsBuilder.js";
import SimpleComponent from "../SimpleComponent.js";
import CopyStatesChangeHandler from "../../state-changes-handler/CopyStatesChangeHandler.js";
import SimpleView from "../../view/SimpleView.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {string} [debuggerElemIdOrJQuery="debugger"]
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
        return /** @type {DebuggerOptionsBuilder} */ this.addStateChangeHandler(debuggerStateChangeHandler);
    }

    /**
     * @param {DebuggerOptions=} debuggerOptions
     * @return {CopyStatesChangeHandler}
     * @protected
     */
    _createDebuggerStateChangeHandler({debuggerElemIdOrJQuery} = {}) {
        debuggerElemIdOrJQuery = debuggerElemIdOrJQuery ?? "debugger";
        const simpleDebugger = new SimpleComponent({
            viewProviderFn: (viewConfig) => new SimpleView(viewConfig),
            elemIdOrJQuery: debuggerElemIdOrJQuery,
            htmlTemplate: "{{#if this}}{{this}}{{else}}No debugging data available yet!{{/if}}"
        }).render();
        return new CopyStatesChangeHandler(simpleDebugger);
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
