import DebuggerOptionsBuilder from "../../../html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

class PeriodicallyStateChangingOptionsBuilder extends DebuggerOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
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
     * @param {DoWithStateAndClockFn} doWithStateAndClockFn
     * @return {PeriodicallyStateChangingOptionsBuilder}
     */
    doPeriodicallyWithStateAndClock(doWithStateAndClockFn) {
        this._options.doWithStateAndClockFn = doWithStateAndClockFn;
        return this;
    }

    /**
     * @param {PeriodicallyStateChangingOptions=} options
     * @return {PeriodicallyStateChangingOptions}
     */
    to(options = {}) {
        if (this._options.clockExtraStateChangesHandlers) {
            options.clockExtraStateChangesHandlers = options.clockExtraStateChangesHandlers ?? [];
            options.clockExtraStateChangesHandlers.push(...this._options.clockExtraStateChangesHandlers);
        }
        if (this._options.doWithStateAndClockFn) {
            options.doWithStateAndClockFn = this._options.doWithStateAndClockFn;
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
