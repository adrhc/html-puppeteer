import StateChangesHandler from "../../../html-puppeteer/core/StateChangesHandler.js";
import ClockComponent from "./ClockComponent.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(component: AbstractComponent, date: Date): *} StateGeneratorFn
 */
/**
 * @template SCT, SCP
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
     * @return {StateGeneratorFn}
     */
    get stateGeneratorFn() {
        return this.clock.config.stateGeneratorFn ?? ClockComponent.DEFAULT_STATE_GENERATOR_FN;
    }

    /**
     * @param {ClockComponent} clock
     */
    constructor(clock) {
        super();
        this.clock = clock;
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