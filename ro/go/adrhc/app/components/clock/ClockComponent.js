import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {simpleStateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessor.js";
import {withDefaultsConfiguratorOf} from "../../../html-puppeteer/core/ComponentConfigurator.js";

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
        super(withDefaultsConfiguratorOf(options,
            (clockComponent) => {
                // stateInitializer must be set inside of a Configurator otherwise, if set after super(),
                // the this.stateInitializer field will override super.stateInitializer because is
                // already declared by AbstractComponent
                clockComponent.stateInitializer = stateInitializerOf(clockComponent);
            }))
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
    return simpleStateProcessorOf(clock, stateChangesHandler, initialClockStateOf(clock));
}

/**
 * @type {AbstractComponent} component
 * @return {ClockState}
 */
function initialClockStateOf(component) {
    const interval = component.config.interval ?? 1000;
    const stopped = component.config.stopped ?? false;
    return {interval, stopped};
}

function stateInitializerOf(component) {
    const {interval} = initialClockStateOf(component);
    return component.config.stateInitializer ??
        new ValuesStateInitializer(component.config.initialState ?? {interval});
}