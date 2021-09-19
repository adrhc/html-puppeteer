import DebuggerOptionsBuilder from "../../../html-puppeteer/core/component/DebuggerOptionsBuilder.js";

class ClockOptionsBuilder extends DebuggerOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStateChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {ClockOptionsBuilder}
     */
    addClockDebugger(debuggerOptions = {}) {
        return this.withOptionsConsumer((options) => {
            options.clockExtraStateChangesHandlers = options.clockExtraStateChangesHandlers ?? [];
            options.clockExtraStateChangesHandlers.push(this._createDebuggerStateChangeHandler(debuggerOptions));
        });
    }

    /**
     * @param {AbstractComponentOptions=} options
     * @return {ClockOptions}
     */
    to(options = {}) {
        if (this._options.clockExtraStateChangesHandlers) {
            options.clockExtraStateChangesHandlers = options.clockExtraStateChangesHandlers ?? [];
            options.clockExtraStateChangesHandlers.push(...this._options.clockExtraStateChangesHandlers);
        }
        return super.to(options);
    }
}

/**
 * @param {DebuggerOptions} debuggerOptions
 * @return {ClockOptionsBuilder}
 */
export function addClockDebugger(debuggerOptions) {
    return new ClockOptionsBuilder().addClockDebugger(debuggerOptions);
}
