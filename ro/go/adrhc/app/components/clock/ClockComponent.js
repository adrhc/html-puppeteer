import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";
import {stateProcessorOf} from "../../../html-puppeteer/core/state/StateProcessor.js";
import {withStateInitializerOf} from "../../../html-puppeteer/core/component/OptionsDsl.js";
import {createDebuggerStateChangeHandler, DebuggerDsl} from "../../../html-puppeteer/util/DebuggingUtils.js";

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
        super(withStateInitializerOf(stateInitializerOf).to(options));
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
 * @param {DebuggerOptions} debuggerOptions
 * @return {ClockDsl}
 */
export function addClockDebugger(debuggerOptions) {
    return new ClockDsl().addClockDebugger(debuggerOptions);
}

class ClockDsl extends DebuggerDsl {
    /**
     * creates then adds a debugger (CopyStateChangeHandler) as an extra StateChangesHandler
     *
     * @param {DebuggerOptions=} debuggerOptions
     * @return {ClockDsl}
     */
    addClockDebugger(debuggerOptions = {}) {
        return this.doWithOptions((options) => {
            options.clockExtraSCHIs = options.clockExtraSCHIs ?? [];
            options.clockExtraSCHIs.push(createDebuggerStateChangeHandler(debuggerOptions));
        });
    }

    /**
     * @param {AbstractComponentOptions=} options
     * @return {ClockOptions}
     */
    to(options = {}) {
        if (this._options.clockExtraSCHIs) {
            options.clockExtraSCHIs = options.clockExtraSCHIs ?? [];
            options.clockExtraSCHIs.push(...this._options.clockExtraSCHIs);
        }
        return super.to(options);
    }
}

/**
 * @param {ClockComponent} clock
 * @return {StateProcessor}
 */
function createClockStateProcessor(clock) {
    return stateProcessorOf({
        component: clock,
        extraStateChangesHandlers: [new ClockStateHandler(clock), ...clock.config.clockExtraSCHIs],
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