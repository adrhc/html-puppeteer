import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import StateGeneratingOnClockStateChanges from "./StateGeneratingOnClockStateChanges.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {withStateInitializerFn} from "../../../html-puppeteer/core/component/OptionsBuilder.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessorBuilder.js";

/**
 * @typedef {StateHolder<ClockState>} ClockStateHolder
 */
/**
 * @typedef {AbstractComponentOptions} ClockOptions
 * @property {StateChangesHandler[]=} clockExtraStateChangesHandlers
 */
export default class PeriodicallyStateChangingComponent extends SimpleComponent {
    /**
     * @type {function(stateUpdaterFn: function(state: ClockStateHolder))}
     */
    doWithClockState;

    /**
     * @param {ClockOptions} options
     * @constructor
     */
    constructor(options) {
        super(withStateInitializerFn(stateInitializerOf).to(options));
        this.config.stateGeneratorFn = this.config.stateGeneratorFn ??
            PeriodicallyStateChangingComponent.DEFAULT_STATE_GENERATOR_FN;
        this.doWithClockState = this.config.doWithClockState ??
            createClockStateProcessor(this,
                this.config.stateGeneratorFn, clockStateOf(this.config),
                this.config.clockExtraStateChangesHandlers).doWithState;
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
 * @param {StateGeneratorFn} stateGeneratorFn
 * @param {ClockState=} initialClockState
 * @param {StateChangesHandler[]=} clockExtraStateChangesHandlers
 * @return {StateProcessor}
 */
function createClockStateProcessor(generatedStateReceiverComponent,
                                   stateGeneratorFn,
                                   initialClockState,
                                   clockExtraStateChangesHandlers) {
    return stateProcessorOf({
        component: generatedStateReceiverComponent,
        extraStateChangesHandlers: [
            new StateGeneratingOnClockStateChanges(generatedStateReceiverComponent, stateGeneratorFn),
            ...(clockExtraStateChangesHandlers ?? [])
        ],
        initialState: initialClockState
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

/**
 * @param {AbstractComponent} component
 * @return {StateInitializer} is the PeriodicallyStateChangingComponent's state initializer
 */
function stateInitializerOf(component) {
    const {interval} = clockStateOf(component.config);
    return component.config.stateInitializer ??
        new ValuesStateInitializer(component.config.initialState ?? {interval});
}