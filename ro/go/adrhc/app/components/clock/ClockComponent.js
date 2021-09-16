import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";
import ClockStateHandler from "./ClockStateHandler.js";
import {doWithStateOf} from "../../../html-puppeteer/util/StateUtils.js";
import {withDefaultsExtraConfiguratorOf} from "../../../html-puppeteer/core/AbstractComponent.js";
import ValuesStateInitializer from "../../../html-puppeteer/core/ValuesStateInitializer.js";

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
     */
    constructor(options) {
        super(withDefaultsExtraConfiguratorOf(options, (component) => {
            const {interval} = clockState(component);
            const initialState = component.options.initialState ?? component.dataAttributes.initialState ?? {interval};
            component.stateInitializer = component.options.stateInitializer ?? new ValuesStateInitializer(initialState);
        }));
        this.doWithClockState = this._createDoWithClockState();
    }

    /**
     * @return {function(stateUpdaterFn: function(state: ClockStateHolder))}
     * @protected
     */
    _createDoWithClockState() {
        const stateGeneratorFn = this.options.stateGeneratorFn ?? ((date) => date);
        const stateChangesHandler = new ClockStateHandler(this, stateGeneratorFn);
        return doWithStateOf(stateChangesHandler, this, clockState(this)).doWithState;
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
 * @type {AbstractComponent} component
 * @return {ClockState}
 * @protected
 */
function clockState(component) {
    // have to use this.options instead of simply options
    // because some configurators might change this.options
    const interval = component.options.interval ?? component.dataAttributes.interval ?? 1000;
    const stopped = component.options.stopped ?? component.dataAttributes.stopped ?? false;
    return {interval, stopped};
}