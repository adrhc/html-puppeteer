import StateChangesHandlerAdapter from "../StateChangesHandlerAdapter.js";
import StateHolder from "../StateHolder.js";

/**
 * @typedef {Object} StateProcessorOptions
 * @property {DoWithStateFn} doWithState
 * @property {StateChangesHandlerAdapter} stateChangesHandlerAdapter
 * @property {StateHolder} stateHolder
 */

/**
 * @typedef {function(stateUpdaterFn: function(state: StateHolder))} DoWithStateFn
 */
export class StateProcessor {
    /**
     * @type {DoWithStateFn}
     */
    doWithState;
    /**
     * @type {StateChangesHandlerAdapter}
     */
    stateChangesHandlerAdapter;
    /**
     * @type {StateHolder}
     */
    stateHolder;

    /**
     * @param {StateProcessorOptions} options
     */
    constructor({stateHolder, stateChangesHandlerAdapter, doWithState}) {
        this.stateHolder = stateHolder;
        this.stateChangesHandlerAdapter = stateChangesHandlerAdapter;
        this.doWithState = doWithState;
    }
}

/**
 * @typedef {StateHolderOptions & StateChangesHandlerAdapterOptions} StateProcessorOptions
 * @property {StateHolder=} stateHolder
 * @property {StateChangesHandlerAdapter=} stateChangesHandlerAdapter
 * @property {DoWithStateFn=} doWithStateFn
 * @property {AbstractComponent=} component
 * @property {*=} initialState
 */

/**
 * @param {StateProcessorOptions} options
 * @param {AbstractComponent} options.component
 * @param {*=} options.initialState
 * @return {StateProcessor}
 */
export function stateProcessorOf({component, initialState, ...options}) {
    const stateChangesHandlerAdapter = new StateChangesHandlerAdapter(options);
    const stateHolder = new StateHolder(options);
    let doWithState = (stateUpdaterFn) => {
        stateUpdaterFn(stateHolder);
        stateChangesHandlerAdapter.processStateChanges(stateHolder.stateChangesCollector);
    };
    doWithState = doWithState.bind(component);
    if (initialState != null) {
        doWithState((sh) => sh.replace(initialState));
    }
    return new StateProcessor({/** @type {DoWithStateFn} */ doWithState, stateHolder, stateChangesHandlerAdapter});
}

/**
 * @param {AbstractComponent} component
 * @param {StateChangesHandler} stateChangesHandler
 * @param {*=} initialState
 */
export function simpleStateProcessorOf(component, stateChangesHandler, initialState) {
    return stateProcessorOf({component, initialState, stateChangesHandlers: [stateChangesHandler]});
}