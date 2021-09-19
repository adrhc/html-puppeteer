import StateChangesHandler from "../../../html-puppeteer/core/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(generatedStateReceiverComponent: AbstractComponent, date: Date): *} StateGeneratorFn
 */
/**
 * @template SCT, SCP
 */
export default class StateGeneratorClockStateChangesHandler extends StateChangesHandler {
    /**
     * @type {AbstractComponent}
     */
    generatedStateReceiverComponent;
    /**
     * @type {number|undefined}
     */
    setIntervalHandle;
    /**
     * @type {StateGeneratorFn}
     */
    stateGeneratorFn;

    /**
     * @param {AbstractComponent} generatedStateReceiverComponent
     * @param {StateGeneratorFn} stateGeneratorFn
     */
    constructor(generatedStateReceiverComponent, stateGeneratorFn) {
        super();
        this.generatedStateReceiverComponent = generatedStateReceiverComponent;
        this.stateGeneratorFn = stateGeneratorFn;
    }

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    changeOccurred(stateChange) {
        const newClockState = /** @type {ClockState} */ stateChange.newStateOrPart;
        if (newClockState.stopped) {
            this._stop();
        } else {
            this._start(newClockState.interval);
        }
    }

    /**
     * starts the generatedStateReceiverComponent
     *
     * @protected
     */
    _start(interval) {
        this._stop();
        const generatedStateReceiverComponent = this.generatedStateReceiverComponent;
        const stateGeneratorFn = this.stateGeneratorFn;
        this.setIntervalHandle = setInterval(() => {
            generatedStateReceiverComponent.doWithState((state) =>
                state.replace(stateGeneratorFn(generatedStateReceiverComponent, new Date())));
        }, interval);
        console.log("clock started");
    }

    /**
     * @protected
     */
    _stop() {
        if (this.setIntervalHandle == null) {
            return;
        }
        clearInterval(this.setIntervalHandle);
        this.setIntervalHandle = undefined;
        console.log("clock stopped");
    }
}