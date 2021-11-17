import {ComponentOptionsBuilder} from "./ComponentOptionsBuilder.js";
import SimpleComponent from "../SimpleComponent.js";
import CopyStatesChangeHandler from "../../state-changes-handler/CopyStatesChangeHandler.js";
import SimpleView, {REMOVE_CONTENT} from "../../view/SimpleView.js";

/**
 * @typedef {Object} DebuggerOptions
 * @property {string} elemIdOrJQuery
 */
export default class DebuggerOptionsBuilder extends ComponentOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions} debuggerOptions
     * @return {DebuggerOptionsBuilder}
     */
    addDebugger(debuggerOptions) {
        const debuggerStateChangesHandler = this._createDebuggerStateChangesHandler(debuggerOptions);
        this.addStateChangesHandler(debuggerStateChangesHandler);
        return this;
    }

    /**
     * @param {DebuggerOptions} debuggerOptions
     * @param {Object} debuggerOptions.restOfOptions
     * @return {CopyStatesChangeHandler}
     * @protected
     */
    _createDebuggerStateChangesHandler({elemIdOrJQuery, ...restOfOptions}) {
        return new CopyStatesChangeHandler({
            receiverComponentFactory: () => new SimpleComponent({
                elemIdOrJQuery,
                viewRemovalStrategy: REMOVE_CONTENT,
                viewProviderFn: viewConfig => new SimpleView(viewConfig),
                ...restOfOptions
            })
        });
    }
}

/**
 * creates options with a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
 *
 * @param {DebuggerOptions} debuggerOptions
 * @return {ComponentOptions}
 */
export function withDebugger(debuggerOptions) {
    return addDebugger(debuggerOptions).options();
}

/**
 * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
 *
 * @param {DebuggerOptions} debuggerOptions
 * @return {DebuggerOptionsBuilder}
 */
export function addDebugger(debuggerOptions) {
    return new DebuggerOptionsBuilder().addDebugger(debuggerOptions);
}
