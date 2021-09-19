import StateChangesHandler from "../../../html-puppeteer/core/state-changes-handler/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(generatedStateReceiverComponent: AbstractComponent, date: Date): *} StateGeneratorFn
 */
/**
 * @typedef {Object} StateGeneratingOnClockStateChangesOptions
 * @property {DoWithStateFn} doWithStateFn
 * @property {StateGeneratorFn} stateGeneratorFn
 */
/**
 * @template SCT, SCP
 * @typedef {function(stateHolder: StateHolder)} DoWithStateFn
 * @extends {StateChangesHandler}
 */
export default class StateGeneratingOnClockStateChanges extends StateChangesHandler {
    /**
     * @type {DoWithStateFn}
     */
    doWithStateFn;
    /**
     * @type {AbstractComponent}
     */
    generatedStateReceiverComponent;
    /**
     * @type {number|undefined}
     */
    setIntervalHandle;

    /**
     * @param {AbstractComponent} generatedStateReceiverComponent
     * @param {StateGeneratingOnClockStateChangesOptions} options
     * @constructor
     */
    constructor(generatedStateReceiverComponent, options) {
        super();
        this.generatedStateReceiverComponent = generatedStateReceiverComponent;
        this.doWithStateFn = options.doWithStateFn ?? ((stateHolder) => {
            const generatedState = options.stateGeneratorFn(generatedStateReceiverComponent, new Date());
            stateHolder.replace(generatedState);
        });
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
        const doWithStateFn = this.doWithStateFn;
        this.setIntervalHandle = setInterval(() =>
            generatedStateReceiverComponent.doWithState((state) => doWithStateFn(state)), interval);
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