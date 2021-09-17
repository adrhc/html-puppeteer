import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {simpleStateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessor.js";
import {setStateInitializerOf} from "../../../html-puppeteer/core/component/OptionsDsl.js";

/**
 * @typedef {StateHolder<ClockState>} ClockStateHolder
 */
/**
 * @typedef {AbstractComponentOptionsWithConfigurator} ClockOptions
 * @property {ComponentConfigurator[]=} clockConfigurators
 */
export default class ClockComponent extends SimpleComponent {
    /**
     * @type {function(stateUpdaterFn: function(state: ClockStateHolder))}
     */
    doWithClockState;

    /**
     * @param {ClockOptions} options
     */
    constructor(options) {
        super(setStateInitializerOf(stateInitializerOf).to(options));
        this.doWithClockState = this.config.doWithClockState ?? createClockStateProcessor(this).doWithState;
        this._executeClockConfigurators();
    }

    static DEFAULT_STATE_GENERATOR_FN = (component, date) => date;

    /**
     * execute ClockComponent only configurators
     */
    _executeClockConfigurators() {
        this.config.clockConfigurators?.forEach(/** @type {ComponentConfigurator} */cc => cc.configure(this));
    }

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
    const stateGeneratorFn = clock.options.stateGeneratorFn ?? ClockComponent.DEFAULT_STATE_GENERATOR_FN;
    const stateChangesHandler = new ClockStateHandler(clock, stateGeneratorFn);
    return simpleStateProcessorOf(clock, stateChangesHandler, initialClockStateOf(clock.config));
}

/**
 * @param {ComponentConfig} componentConfig
 * @return {ClockState} is the initial state used to construct ClockComponent.doWithClockState
 */
function initialClockStateOf(componentConfig) {
    const interval = componentConfig.interval ?? 1000;
    const stopped = componentConfig.stopped ?? false;
    return {interval, stopped};
}

/**
 * @param {AbstractComponent} component
 * @return {StateInitializer} is the ClockComponent's state initializer
 */
function stateInitializerOf(component) {
    const {interval} = initialClockStateOf(component.config);
    return component.config.stateInitializer ??
        new ValuesStateInitializer(component.config.initialState ?? {interval});
}