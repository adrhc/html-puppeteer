import DefaultComponentConfigurator from "./DefaultComponentConfigurator.js";
import {defaultsConfiguratorOf, stateCHAConfiguratorOf} from "./ComponentConfigurator.js";

/**
 * @typedef {{[key:string]:*} & StateChangesHandlerAdapterOptions & AbstractTemplatingViewOptionsWithView} AbstractComponentOptions
 * @property {boolean=} dontConfigure
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
     * @typedef {AbstractComponentOptions & DataAttributes}
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
     * @param {ComponentConfigurator=} options.configurator
     * @param {AbstractComponentOptions=} restOfOptions
     */
    constructor({dontConfigure, configurator, ...restOfOptions}) {
        this._configure(restOfOptions, dontConfigure);
    }

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     * @param {boolean=} dontConfigure
     * @protected
     */
    _configure(options, dontConfigure) {
        if (dontConfigure) {
            return;
        }
        const configurator = options.configurator ?? this._createComponentConfigurator(options);
        configurator.configure(this);
    }

    /**
     * @param {AbstractComponentOptions} options
     * @protected
     */
    _createComponentConfigurator(options) {
        return new DefaultComponentConfigurator(options);
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

/**
 * @param {AbstractComponentOptionsWithConfigurator} options
 * @param {ComponentConfigurator} configuratorToAppend
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function extraConfiguratorsOf(options, configuratorToAppend) {
    options.extraConfigurators = options.extraConfigurators ?? [];
    options.extraConfigurators.push(configuratorToAppend);
    return options;
}

/**
 * @param {AbstractComponentOptions} options
 * @param {function(component: StateChangesHandlerAdapter)} configureStateChangesHandlerAdapterFn
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withStateChangesHandlerAdapterConfiguratorOf(options, configureStateChangesHandlerAdapterFn) {
    return extraConfiguratorsOf(options, stateCHAConfiguratorOf(configureStateChangesHandlerAdapterFn))
}

/**
 * @param {AbstractComponentOptions} options
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withDefaultsConfiguratorOf(options, setComponentDefaultsFn) {
    return extraConfiguratorsOf(options, defaultsConfiguratorOf(setComponentDefaultsFn))
}
