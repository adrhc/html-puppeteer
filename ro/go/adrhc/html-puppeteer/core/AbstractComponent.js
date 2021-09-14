import StateHolder from "./StateHolder.js";
import ValuesStateInitializer from "./ValuesStateInitializer.js";
import StateChangesHandlerAdapter from "./StateChangesHandlerAdapter.js";

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
     * @param {StateChangesHandler[]} config.extraStateChangesHandlers
     * @param {StateChangesHandler[]} config.stateChangesHandlers
     * @param {string} config.partMethodPrefix
     */
    constructor({
                    initialState,
                    stateHolder,
                    stateInitializer,
                    stateChangesHandlerAdapter,
                    componentIllustrator,
                    partsAllocator,
                    extraStateChangesHandlers,
                    stateChangesHandlers,
                    partMethodPrefix
                }) {
        this.stateHolder = stateHolder ?? this._createStateHolder();
        this.stateInitializer = stateInitializer ?? this._createStateInitializer(initialState);
        this.stateChangesHandlerAdapter = stateChangesHandlerAdapter ??
            this._createStateChangesHandlerAdapter({
                componentIllustrator,
                partsAllocator,
                extraStateChangesHandlers,
                stateChangesHandlers,
                partMethodPrefix
            });
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new StateHolder();
    }

    /**
     * @param {Object} config
     * @param {ComponentIllustrator} config.componentIllustrator
     * @param {PartsAllocator} config.partsAllocator
     * @param {StateChangesHandler[]} config.extraStateChangesHandlers
     * @param {StateChangesHandler[]} config.stateChangesHandlers
     * @param {string} config.partMethodPrefix
     * @return {StateChangesHandlerAdapter}
     * @protected
     */
    _createStateChangesHandlerAdapter({
                                          componentIllustrator,
                                          partsAllocator,
                                          extraStateChangesHandlers,
                                          stateChangesHandlers,
                                          partMethodPrefix
                                      } = {}) {
        return new StateChangesHandlerAdapter({
            componentIllustrator,
            partsAllocator,
            extraStateChangesHandlers,
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
        return initialState != null ? new ValuesStateInitializer(initialState) : undefined;
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        if (value != null) {
            this.doWithState(sh => {
                sh.replace(value);
            });
        } else if (this.stateInitializer) {
            this._initializeState();
        }
        return this;
    }

    /**
     * @protected
     */
    _initializeState() {
        this.doWithState((stateHolder) => {
            this.stateInitializer.load(stateHolder);
        });
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param {function(state: StateHolder)} stateUpdaterFn
     * @return {StateChange[]}
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        this.stateChangesHandlerAdapter.processStateChanges(this.stateHolder.stateChangesCollector);
    }

    /**
     * set state to undefined
     */
    close() {
        this.stateHolder.replace();
    }
}