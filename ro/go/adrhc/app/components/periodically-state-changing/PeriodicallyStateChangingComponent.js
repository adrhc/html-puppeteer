import SimpleComponent from "../../../html-puppeteer/core/component/SimpleComponent.js";
import StateGeneratingOnClockStateChanges from "./StateGeneratingOnClockStateChanges.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state-processor/StateProcessorBuilder.js";
import {StateProcessor} from "../../../html-puppeteer/core/state-processor/StateProcessor.js";

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
     * @type {StateProcessor}
     */
    clockStateProcessor;

    /**
     * @param {PeriodicallyStateChangingOptions} options
     * @constructor
     */
    constructor(options) {
        super(options);
        this.config.stateGeneratorFn = this.config.stateGeneratorFn ??
            PeriodicallyStateChangingComponent.DEFAULT_STATE_GENERATOR_FN;
        this.clockStateProcessor = this.config.clockStateProcessor ??
            createClockStateProcessor(this,  /** @type {ClockStateProcessorOptions} */ this.config);
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
        this.clockStateProcessor.doWithState((clockState) => {
            const state = clockState.currentState;
            clockState.replace({...state, stopped: false});
        })
    }

    /**
     * stops the clock
     */
    stopClock() {
        this.clockStateProcessor.doWithState((clockState) => {
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
 * @return {ClockState}
 */
function clockStateOf(object) {
    const interval = object?.interval ?? 1000;
    const stopped = object?.stopped ?? false;
    return {interval, stopped};
}
