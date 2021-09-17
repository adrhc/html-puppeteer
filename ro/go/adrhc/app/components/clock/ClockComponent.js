import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
import {withDefaultsConfiguratorOf} from "../../../html-puppeteer/core/AbstractComponent.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {simpleStateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessor.js";

/**
 * @typedef {StateHolder<ClockState>} ClockStateHolder
 */
export default class ClockComponent extends SimpleComponent {
    /**
     * @type {function(stateUpdaterFn: function(state: ClockStateHolder))}
     */
    doWithClockState;

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     * @param {AbstractComponentOptions=} restOfOptions
     */
    constructor({dontConfigure, ...restOfOptions}) {
        super(withDefaultsConfiguratorOf({dontConfigure: true, ...restOfOptions},
            (clockComponent) => {
                // stateInitializer must be set inside of a Configurator otherwise, if set after super(),
                // the this.stateInitializer field will override super.stateInitializer because is
                // already declared by AbstractComponent
                clockComponent.stateInitializer = stateInitializerOf(clockComponent);
                // this could be placed out of the configurator with no overriding
                // risk but it's better to keep it in the configurator to give
                // the extending classes the chance to configure/override it too
                clockComponent.doWithClockState = createClockStateProcessor(
                    /** @type {ClockComponent} */ clockComponent).doWithState;
            }));
        this._configure(restOfOptions, dontConfigure);
    }

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