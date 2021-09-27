import {ComponentOptionsBuilder} from "./ComponentOptionsBuilder.js";
import SimpleComponent from "../SimpleComponent.js";
import CopyStatesChangeHandler from "../../state-changes-handler/CopyStatesChangeHandler.js";
import SimpleView, {REMOVE_CONTENT, USE_HTML} from "../../view/SimpleView.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {string} [debuggerElemIdOrJQuery="debugger"]
 */
export default class DebuggerOptionsBuilder extends ComponentOptionsBuilder {
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
            viewRemovalStrategy: REMOVE_CONTENT,
            elemIdOrJQuery: debuggerElemIdOrJQuery
        }).render();
        return new CopyStatesChangeHandler(simpleDebugger);
    }
}

/**
 * creates options with a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
 *
 * @param {DebuggerOptions=} debuggerOptions
 * @return {ComponentOptions}
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
