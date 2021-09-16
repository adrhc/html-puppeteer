import DefaultComponentConfigurator from "./DefaultComponentConfigurator.js";
import {defaultsExtraConfiguratorOf, stateChangesHandlerAdapterExtraConfiguratorOf} from "./ComponentConfigurator.js";

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
export default class AbstractComponent {
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
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
    constructor({configurator, ...restOfOptions}) {
        configurator = configurator ?? this._createComponentConfigurator(restOfOptions);
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
export function withStateChangesHandlerAdapterExtraConfiguratorOf(options, configureStateChangesHandlerAdapterFn) {
    return extraConfiguratorsOf(options, stateChangesHandlerAdapterExtraConfiguratorOf(configureStateChangesHandlerAdapterFn))
}

/**
 * @param {AbstractComponentOptions} options
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withDefaultsExtraConfiguratorOf(options, setComponentDefaultsFn) {
    return extraConfiguratorsOf(options, defaultsExtraConfiguratorOf(setComponentDefaultsFn))
}
