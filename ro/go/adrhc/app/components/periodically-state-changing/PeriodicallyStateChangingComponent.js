import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import StateGeneratingOnClockStateChanges from "./StateGeneratingOnClockStateChanges.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessorBuilder.js";

/**
 * @typedef {ClockState} ClockStateProcessorOptions
 * @property {StateGeneratorFn} stateGeneratorFn
 * @property {StateChangesHandler[]=} clockExtraStateChangesHandlers
 * @property {number=} interval
 * @property {boolean=} stopped
 */
/**
 * @typedef {StateHolder<ClockState>} ClockStateHolder
 */
/**
 * @typedef {AbstractComponentOptions & ClockStateProcessorOptions} PeriodicallyStateChangingOptions
 */
export default class PeriodicallyStateChangingComponent extends SimpleComponent {
    /**
     * @type {function(stateUpdaterFn: function(state: ClockStateHolder))}
     */
    doWithClockState;

    /**
     * @param {PeriodicallyStateChangingOptions} options
     * @constructor
     */
    constructor(options) {
        super(options);
        this.config.stateGeneratorFn = this.config.stateGeneratorFn ??
            PeriodicallyStateChangingComponent.DEFAULT_STATE_GENERATOR_FN;
        this.doWithClockState = this.config.doWithClockState ??
            createClockStateProcessor(this,  /** @type {ClockStateProcessorOptions} */ this.config)
                .doWithState;
    }

    /**
     * @type {StateGeneratorFn}
     * @constant
     * @default
     */
    static DEFAULT_STATE_GENERATOR_FN = (generatedStateReceiverComponent, date) => date;

    /**
     * stops the clock
     */
    startClock() {
        this.doWithClockState((clockState) => {
            const state = clockState.currentState;
            clockState.replace({...state, stopped: false});
        })
    }

    /**
     * stops the clock
     */
    stopClock() {
        this.doWithClockState((clockState) => {
            const state = clockState.currentState;
            clockState.replace({...state, stopped: true});
        })
    }
}

/**
 * @param {PeriodicallyStateChangingComponent} generatedStateReceiverComponent
 * @param {ClockStateProcessorOptions} options
 * @return {StateProcessor}
 */
function createClockStateProcessor(generatedStateReceiverComponent,
                                   options) {
    return stateProcessorOf({
        extraStateChangesHandlers: [
            new StateGeneratingOnClockStateChanges(generatedStateReceiverComponent, options.stateGeneratorFn),
            ...(options.clockExtraStateChangesHandlers ?? [])
        ],
        initialState: clockStateOf(options)
    });
}

/**
 * @param {Bag=} object
 * @return {ClockState} is the initial state used to construct PeriodicallyStateChangingComponent.doWithClockState
 */
function clockStateOf(object) {
    const interval = object?.interval ?? 1000;
    const stopped = object?.stopped ?? false;
    return {interval, stopped};
}
