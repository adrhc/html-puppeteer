import StateHolder from "./StateHolder";
import ValuesStateInitializer from "./ValuesStateInitializer";

export default class AbstractComponent {
    /**
     * @type {StateChangesHandlerAdapter}
     */
    stateChangesHandlerAdapter;
    /**
     * @type {StateHolder}
     */
    stateHolder;
    /**
     * @type {StateInitializer}
     */
    stateInitializer;

    /**
     * @param {Object} config
     * @param {*=} config.initialState
     * @param {StateHolder=} config.stateHolder
     * @param {StateInitializer=} config.stateInitializer
     */
    constructor({initialState, stateHolder, stateInitializer} = {}) {
        this.stateHolder = stateHolder ?? new StateHolder();
        this._setStateInitializer(stateInitializer, initialState);
    }

    _setStateChangesHandlerAdapter() {
        this.stateChangesHandlerAdapter = new StateChangesHandlerAdapter();
    }

    /**
     * @param {StateInitializer} stateInitializer
     * @param {*} initialState
     * @protected
     */
    _setStateInitializer(stateInitializer, initialState) {
        if (stateInitializer != null) {
            this.stateInitializer = stateInitializer;
        } else if (initialState != null) {
            this.stateInitializer = new ValuesStateInitializer(initialState, this.stateHolder);
        }
    }

    /**
     * @param {*} values
     * @abstract
     */
    render(values) {
        if (values != null) {
            this.doWithState(sh => {
                sh.replace(values);
            });
        }
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param {function(state: StateHolder)} stateUpdaterFn
     * @return {StateChange[]}
     * @protected
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        this.stateChangesHandlerAdapter.processStateChanges(this.stateHolder.stateChangesCollector);
    }

    /**
     * @abstract
     */
    close() {}
}