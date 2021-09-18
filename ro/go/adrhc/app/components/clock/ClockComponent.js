import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
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
        this.doWithClockState = this.config.doWithClockState ?? createClockStateProcessor(this).doWithState;
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
 * @param {ClockComponent} clock
 * @return {StateProcessor}
 */
function createClockStateProcessor(clock) {
    return stateProcessorOf({
        component: clock,
        extraStateChangesHandlers: [new ClockStateHandler(clock), ...(clock.config.clockExtraSCHIs ?? [])],
        initialState: initialInternalClockStateOf(clock.config)
    });
}

/**
 * @param {ComponentConfigField} componentConfig
 * @return {ClockState} is the initial state used to construct ClockComponent.doWithClockState
 */
function initialInternalClockStateOf(componentConfig) {
    const interval = componentConfig.interval ?? 1000;
    const stopped = componentConfig.stopped ?? false;
    return {interval, stopped};
}

/**
 * @param {AbstractComponent} component
 * @return {StateInitializer} is the ClockComponent's state initializer
 */
function stateInitializerOf(component) {
    const {interval} = initialInternalClockStateOf(component.config);
    return component.config.stateInitializer ??
        new ValuesStateInitializer(component.config.initialState ?? {interval});
}