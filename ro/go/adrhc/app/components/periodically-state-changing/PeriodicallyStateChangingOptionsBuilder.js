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
     * @param {DoWithStateAndClockFn} doWithStateFn
     * @return {PeriodicallyStateChangingOptionsBuilder}
     */
    doPeriodicallyWithState(doWithStateFn) {
        this._options.doWithStateFn = doWithStateFn;
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
        if (this._options.doWithStateFn) {
            options.doWithStateFn = this._options.doWithStateFn;
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

/**
 * @param {DoWithStateAndClockFn} doWithStateFn
 */
export function doPeriodicallyWithState(doWithStateFn) {
    return new PeriodicallyStateChangingOptionsBuilder().doPeriodicallyWithState(doWithStateFn);
}