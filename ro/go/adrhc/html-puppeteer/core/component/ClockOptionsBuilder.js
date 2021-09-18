import DebuggerOptionsBuilder from "./DebuggerOptionsBuilder.js";

export default class ClockOptionsBuilder extends DebuggerOptionsBuilder {
    /**
     * creates then adds a debugger (CopyStateChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {ClockOptionsBuilder}
     */
    addClockDebugger(debuggerOptions = {}) {
        return this.withOptionsConsumer((options) => {
            options.clockExtraSCHIs = options.clockExtraSCHIs ?? [];
            options.clockExtraSCHIs.push(this._createDebuggerStateChangeHandler(debuggerOptions));
        });
    }

    /**
     * @param {AbstractComponentOptions=} options
     * @return {ClockOptions}
     */
    to(options = {}) {
        if (this._options.clockExtraSCHIs) {
            options.clockExtraSCHIs = options.clockExtraSCHIs ?? [];
            options.clockExtraSCHIs.push(...this._options.clockExtraSCHIs);
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
