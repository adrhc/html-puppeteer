import StateHolder from "./StateHolder";
import ValuesStateInitializer from "./ValuesStateInitializer";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter";

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
     * @param {StateChangesHandlerAdapter} config.stateChangesHandlerAdapter
     * @param {ComponentIllustrator} config.componentIllustrator
     * @param {PartsAllocator} config.partsAllocator
     * @param {StateChangesHandler[]} config.stateChangesHandlers
     * @param {string} config.partMethodPrefix
     */
    constructor({
                    initialState, stateHolder, stateInitializer, stateChangesHandlerAdapter,
                    componentIllustrator, partsAllocator, stateChangesHandlers, partMethodPrefix
                }) {
        this.stateHolder = stateHolder ?? this._createStateHolder();
        this.stateInitializer = stateInitializer ?? this._createStateInitializer(initialState);
        this.stateChangesHandlerAdapter = stateChangesHandlerAdapter ??
            this._createStateChangesHandlerAdapter(componentIllustrator, partsAllocator, stateChangesHandlers, partMethodPrefix);
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new StateHolder();
    }

    /**
     * @param {ComponentIllustrator} componentIllustrator
     * @param {PartsAllocator} partsAllocator
     * @param {StateChangesHandler[]} stateChangesHandlers
     * @param {string} partMethodPrefix
     * @return {StateChangesHandlerAdapter}
     * @protected
     */
    _createStateChangesHandlerAdapter(componentIllustrator, partsAllocator, stateChangesHandlers, partMethodPrefix) {
        return new StateChangesHandlerAdapter({
            componentIllustrator,
            partsAllocator,
            stateChangesHandlers,
            partMethodPrefix
        });
    }

    /**
     * @param {*=} initialState
     * @return {StateInitializer}
     * @protected
     */
    _createStateInitializer(initialState) {
        return initialState != null ? new ValuesStateInitializer(initialState, this.stateHolder) : undefined;
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