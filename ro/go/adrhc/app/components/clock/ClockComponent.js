import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import StateGeneratorClockStateChangesHandler from "./StateGeneratorClockStateChangesHandler.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {withStateInitializerFn} from "../../../html-puppeteer/core/component/OptionsBuilder.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessorBuilder.js";

/**
 * @typedef {StateHolder<ClockState>} ClockStateHolder
 */
/**
 * @typedef {AbstractComponentOptions} ClockOptions
 * @property {ComponentConfigurator[]=} clockConfigurators
 */
export default class ClockComponent extends SimpleComponent {
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
        this.doWithClockState = this.config.doWithClockState ?? createClockStateProcessor(this,
            this.config.stateGeneratorFn, this.config, this.config.clockExtraStateChangesHandlers).doWithState;
    }

    /**
     * @param {AbstractComponent} component
     * @param {Date} date
     * @constant
     * @default
     */
    static DEFAULT_STATE_GENERATOR_FN = (component, date) => date;

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
 * @param {ClockComponent} generatedStateReceiverComponent
 * @param {StateGeneratorFn} stateGeneratorFn
 * @param {Bag=} initialClockStateValues
 * @param {StateChangesHandler[]=} clockExtraStateChangesHandlers
 * @return {StateProcessor}
 */
function createClockStateProcessor(generatedStateReceiverComponent,
                                   stateGeneratorFn,
                                   initialClockStateValues,
                                   clockExtraStateChangesHandlers) {
    return stateProcessorOf({
        component: generatedStateReceiverComponent,
        extraStateChangesHandlers: [
            new StateGeneratorClockStateChangesHandler(generatedStateReceiverComponent, stateGeneratorFn),
            ...(clockExtraStateChangesHandlers ?? [])
        ],
        initialState: clockStateOf(initialClockStateValues)
    });
}

/**
 * @param {Bag=} object
 * @return {ClockState} is the initial state used to construct ClockComponent.doWithClockState
 */
function clockStateOf(object) {
    const interval = object?.interval ?? 1000;
    const stopped = object?.stopped ?? false;
    return {interval, stopped};
}

/**
 * @param {AbstractComponent} component
 * @return {StateInitializer} is the ClockComponent's state initializer
 */
function stateInitializerOf(component) {
    const {interval} = clockStateOf(component.config);
    return component.config.stateInitializer ??
        new ValuesStateInitializer(component.config.initialState ?? {interval});
}