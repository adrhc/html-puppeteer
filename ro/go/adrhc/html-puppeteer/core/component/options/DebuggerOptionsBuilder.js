import {ComponentOptionsBuilder} from "./ComponentOptionsBuilder.js";
import SimpleComponent from "../SimpleComponent.js";
import CopyStatesChangeHandler from "../../state-changes-handler/CopyStatesChangeHandler.js";
import SimpleView, {REMOVE_CONTENT} from "../../view/SimpleView.js";

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
        const debuggerStateChangesHandler = this._createDebuggerStateChangesHandler(debuggerOptions);
        this.addStateChangesHandler(debuggerStateChangesHandler);
        return this;
    }

    /**
     * @param {DebuggerOptions=} debuggerOptions
     * @return {CopyStatesChangeHandler}
     * @protected
     */
    _createDebuggerStateChangesHandler({debuggerElemIdOrJQuery} = {}) {
        const debuggerComponent = new SimpleComponent({
            viewProviderFn: (viewConfig) => new SimpleView(viewConfig),
            viewRemovalStrategy: REMOVE_CONTENT,
            elemIdOrJQuery: debuggerElemIdOrJQuery ?? "debugger"
        }).render();
        return new CopyStatesChangeHandler(debuggerComponent);
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
