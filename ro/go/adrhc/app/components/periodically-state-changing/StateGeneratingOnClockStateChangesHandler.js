import StateChangesHandler from "../../../html-puppeteer/core/state-changes-handler/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(componentConfig: AbstractComponentOptions, date: Date): *} StateGeneratorFn
 */
/**
 * @typedef {Object} StateGeneratingOnClockStateChangesHandlerOptions
 * @property {DoWithStateFn} doWithStateFn
 * @property {StateGeneratorFn} stateGeneratorFn
 */
/**
 * Using clock events to start/stop the interval-time.
 * Using StateGeneratingOnClockStateChangesHandlerOptions to construct the
 * doWithStateFn to be used to change the state of generatedStateReceiverComponent.
 * 
 * @template SCT, SCP
 * @typedef {function(stateHolder: PartialStateHolder)} DoWithStateFn
 * @extends {StateChangesHandler}
 */
export default class StateGeneratingOnClockStateChangesHandler extends StateChangesHandler {
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
     * @param {StateGeneratingOnClockStateChangesHandlerOptions} options
     * @constructor
     */
    constructor(generatedStateReceiverComponent, options) {
        super();
        this.generatedStateReceiverComponent = generatedStateReceiverComponent;
        this.doWithStateFn = options.doWithStateFn ?? ((stateHolder) => {
            const generatedState = options.stateGeneratorFn(generatedStateReceiverComponent.config, new Date());
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