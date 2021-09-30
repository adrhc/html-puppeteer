import SimpleComponent from "../../../html-puppeteer/core/component/SimpleComponent.js";
import StateGeneratingOnClockStateChangesHandler from "./StateGeneratingOnClockStateChangesHandler.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state-processor/StateProcessorBuilder.js";
import {StateProcessor} from "../../../html-puppeteer/core/state-processor/StateProcessor.js";

/**
 * @typedef {ClockState & StateGeneratingOnClockStateChangesHandlerOptions} ClockStateProcessorOptions
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
        const stateGeneratorFn = this.config.stateGeneratorFn ??
            PeriodicallyStateChangingComponent.DEFAULT_STATE_GENERATOR_FN;
        this.clockStateProcessor = this.config.clockStateProcessor ??
            createClockStateProcessor(this, /** @type {ClockStateProcessorOptions} */ {
                ...this.config,
                stateGeneratorFn
            });
    }

    /**
     * @type {StateGeneratorFn}
     * @constant
     * @default
     */
    static DEFAULT_STATE_GENERATOR_FN = () => new Date();

    /**
     * stops the clock
     */
    startClock() {
        this.clockStateProcessor.doWithState((clockState) => {
            const state = clockState.stateCopy;
            clockState.replace({...state, stopped: false});
        })
    }

    /**
     * stops the clock
     */
    stopClock() {
        this.clockStateProcessor.doWithState((clockState) => {
            const state = clockState.stateCopy;
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
            new StateGeneratingOnClockStateChangesHandler(generatedStateReceiverComponent, options),
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
