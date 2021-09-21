import StateChangesHandler from "../../../html-puppeteer/core/state-changes-handler/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(componentConfig: AbstractComponentOptions, clockStateChange: StateChange): *} StateGeneratorFn
 */
/**
 * @typedef {Object} StateGeneratingOnClockStateChangesHandlerOptions
 * @property {DoWithStateAndClockFn} doWithStateAndClockFn
 * @property {StateGeneratorFn} stateGeneratorFn
 */
/**
 * Using clock events to start/stop the interval-time.
 * Using StateGeneratingOnClockStateChangesHandlerOptions to construct the
 * doWithStateAndClockFn to be used to change the state of generatedStateReceiverComponent.
 *
 * @template SCT, SCP
 * @typedef {function(stateHolder: PartialStateHolder, clockStateChange: StateChange)} DoWithStateAndClockFn
 * @extends {StateChangesHandler}
 */
export default class StateGeneratingOnClockStateChangesHandler extends StateChangesHandler {
    /**
     * @type {DoWithStateAndClockFn}
     */
    doWithStateAndClockFn;
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
        this.doWithStateAndClockFn = options.doWithStateAndClockFn ?? ((stateHolder, clockStateChange) => {
            const generatedState = options.stateGeneratorFn(generatedStateReceiverComponent.config, clockStateChange);
            stateHolder.replace(generatedState);
        });
    }

    /**
     * @param {StateChange<SCT, SCP>} clockStateChange
     */
    changeOccurred(clockStateChange) {
        const newClockState = /** @type {ClockState} */ clockStateChange.newState;
        if (newClockState.stopped) {
            this._stop();
        } else {
            this._start(clockStateChange);
        }
    }

    /**
     * starts the generatedStateReceiverComponent
     *
     * @param {StateChange<SCT, SCP>} clockStateChange
     * @protected
     */
    _start(clockStateChange) {
        this._stop();
        const interval = (/** @type {ClockState} */ clockStateChange.newState).interval;
        const generatedStateReceiverComponent = this.generatedStateReceiverComponent;
        const doWithStateAndClockFn = this.doWithStateAndClockFn;
        this.setIntervalHandle = setInterval(() =>
            generatedStateReceiverComponent.doWithState((state) =>
                doWithStateAndClockFn(state, clockStateChange)), interval);
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