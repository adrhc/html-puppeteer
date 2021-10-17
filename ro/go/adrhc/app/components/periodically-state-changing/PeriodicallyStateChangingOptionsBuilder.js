import DebuggerOptionsBuilder from "../../../html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

class PeriodicallyStateChangingOptionsBuilder extends DebuggerOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStatesChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {PeriodicallyStateChangingOptionsBuilder}
     */
    addClockDebugger(debuggerOptions = {}) {
        this.withOptionsConsumer((options) => {
            options.clockExtraStateChangesHandlers = options.clockExtraStateChangesHandlers ?? [];
            options.clockExtraStateChangesHandlers.push(this._createDebuggerStateChangesHandler(debuggerOptions));
        });
        return this;
    }

    /**
     * @param {DoWithStateAndClockFn} doWithStateAndClockFn
     * @return {PeriodicallyStateChangingOptionsBuilder}
     */
    doPeriodicallyWithStateAndClock(doWithStateAndClockFn) {
        this.builderOptions.doWithStateAndClockFn = doWithStateAndClockFn;
        return this;
    }

    /**
     * @param {PeriodicallyStateChangingOptions=} currentConstructorOptions
     * @return {PeriodicallyStateChangingOptions}
     */
    to(currentConstructorOptions = {}) {
        const clockExtraStateChangesHandlers = [
            ...(currentConstructorOptions.clockExtraStateChangesHandlers ?? []),
            ...(this.builderOptions.clockExtraStateChangesHandlers ?? []),
            ...(this.descendantComponentClassOptions.clockExtraStateChangesHandlers ?? [])
        ];
        const doWithStateAndClockFn = this.descendantComponentClassOptions.doWithStateAndClockFn ??
            this.builderOptions.doWithStateAndClockFn ?? currentConstructorOptions.doWithStateAndClockFn;
        return super.to({...currentConstructorOptions, clockExtraStateChangesHandlers, doWithStateAndClockFn});
    }
}

/**
 * @param {DebuggerOptions} debuggerOptions
 * @return {PeriodicallyStateChangingOptionsBuilder}
 */
export function addClockDebugger(debuggerOptions) {
    return new PeriodicallyStateChangingOptionsBuilder().addClockDebugger(debuggerOptions);
}
