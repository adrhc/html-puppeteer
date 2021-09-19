import DebuggerOptionsBuilder from "../../../html-puppeteer/core/component/DebuggerOptionsBuilder.js";

class PeriodicallyStateChangingOptionsBuilder extends DebuggerOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStateChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {PeriodicallyStateChangingOptionsBuilder}
     */
    addClockDebugger(debuggerOptions = {}) {
        return this.withOptionsConsumer((options) => {
            options.clockExtraStateChangesHandlers = options.clockExtraStateChangesHandlers ?? [];
            options.clockExtraStateChangesHandlers.push(this._createDebuggerStateChangeHandler(debuggerOptions));
        });
    }

    /**
     * @param {AbstractComponentOptions=} options
     * @return {PeriodicallyStateChangingOptions}
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
 * @return {PeriodicallyStateChangingOptionsBuilder}
 */
export function addClockDebugger(debuggerOptions) {
    return new PeriodicallyStateChangingOptionsBuilder().addClockDebugger(debuggerOptions);
}
