import StateChangesHandler from "../../../html-puppeteer/core/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(component: AbstractComponent, date: Date): *} StateGeneratorFn
 */
export default class ClockStateHandler extends StateChangesHandler {
    /**
     * @type {ClockComponent}
     */
    clock;
    /**
     * @type {number|undefined}
     */
    handle;
    /**
     * @type {StateGeneratorFn}
     */
    stateGeneratorFn;

    /**
     * @param {ClockComponent} clock
     * @param {StateGeneratorFn} stateGeneratorFn
     */
    constructor(clock, stateGeneratorFn) {
        super();
        this.clock = clock;
        this.stateGeneratorFn = stateGeneratorFn;
    }

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    changeOccurred(stateChange) {
        const clockState = /** @type {ClockState} */ stateChange.newStateOrPart;
        if (clockState.stopped) {
            this._stop();
        } else {
            this._start(clockState.interval);
        }
    }

    /**
     * starts the clock
     *
     * @protected
     */
    _start(interval) {
        this._stop();
        const clock = this.clock;
        const stateGeneratorFn = this.stateGeneratorFn;
        this.handle = setInterval(() => {
            clock.doWithState((state) =>
                state.replace(stateGeneratorFn(clock, new Date())));
        }, interval);
        console.log("clock started");
    }

    /**
     * @protected
     */
    _stop() {
        if (this.handle == null) {
            return;
        }
        clearInterval(this.handle);
        this.handle = undefined;
        console.log("clock stopped");
    }
}