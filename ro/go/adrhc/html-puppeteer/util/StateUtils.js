import {stateCHAOf} from "../core/StateChangesHandlerAdapter.js";
import StateHolder from "../core/StateHolder.js";

/**
 * @typedef {function(stateUpdaterFn: function(state: StateHolder))} DoWithStateFn
 */
/**
 * @typedef {{doWithState: DoWithStateFn, stateHolder: StateHolder}} DoWithStateOf
 */
/**
 * @param {StateChangesHandler} stateChangesHandler
 * @param {AbstractComponent} component
 * @param {*=} initialState
 * @return {DoWithStateOf}
 */
export function doWithStateOf(stateChangesHandler, component, initialState) {
    const schAdapter = stateCHAOf(stateChangesHandler);
    const stateHolder = new StateHolder();
    let doWithState = (stateUpdaterFn) => {
        stateUpdaterFn(stateHolder);
        schAdapter.processStateChanges(stateHolder.stateChangesCollector);
    };
    doWithState = doWithState.bind(component);
    if (initialState != null) {
        doWithState((sh) => sh.replace(initialState));
    }
    return {/** @type {DoWithStateFn} */ doWithState, stateHolder};
}