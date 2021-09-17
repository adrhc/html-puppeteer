import DefaultComponentConfigurator from "./DefaultComponentConfigurator.js";

/**
 * @typedef {{[key:string]:*} & StateChangesHandlerAdapterOptions & AbstractTemplatingViewOptionsWithView} AbstractComponentOptions
 * @property {ComponentConfigurator[]=} extraConfigurators
 * @property {string=} elemIdOrJQuery
 * @property {StateHolder=} stateHolder
 * @property {StateInitializer=} stateInitializer
 * @property {*=} initialState
 * @property {StateChangesHandlerAdapter=} stateChangesHandlerAdapter
 */
/**
 * @typedef {AbstractComponentOptions} AbstractComponentOptionsWithConfigurator
 * @property {ComponentConfigurator=} configurator
 */
/**
 * @abstract
 */
export default class AbstractComponent {
    /**
     * @type {AbstractComponentOptions & DataAttributes}
     */
    config;
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {EventsBinder}
     */
    eventsBinder;
    /**
     * @type {AbstractComponentOptions}
     */
    options;
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
     * @param {AbstractComponentOptionsWithConfigurator} options
     */
    constructor(options) {
        this._configure(options);
    }

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     * @protected
     */
    _configure(options) {
        const configurator = options.configurator ?? new DefaultComponentConfigurator(options);
        configurator.configure(this);
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
        this.eventsBinder.attachEventHandlers();
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
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        this.stateChangesHandlerAdapter.processStateChanges(this.stateHolder.stateChangesCollector);
    }

    /**
     * set state to undefined
     */
    close() {
        this.eventsBinder.detachEventHandlers();
        this.stateHolder.replace();
    }
}
