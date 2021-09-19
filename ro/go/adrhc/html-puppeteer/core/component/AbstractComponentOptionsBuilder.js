import ComponentConfigurator from "../ComponentConfigurator.js";

/**
 * @typedef {function(component: AbstractComponent): StateInitializer} StateInitializerProviderFn
 */
/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */
export class AbstractComponentOptionsBuilder {
    /**
     * @type {Bag}
     */
    _options = {};

    options() {
        return this.to();
    }

    /**
     * This is the equivalent of Builder.build()
     *
     * @param {AbstractComponentOptions=} options
     * @return {AbstractComponentOptions}
     */
    to(options = {}) {
        if (this._options.extraConfigurators) {
            options.extraConfigurators = options.extraConfigurators ?? [];
            options.extraConfigurators.push(...this._options.extraConfigurators);
        }
        if (this._options.extraStateChangesHandlers) {
            options.extraStateChangesHandlers = options.extraStateChangesHandlers ?? [];
            options.extraStateChangesHandlers.push(...this._options.extraStateChangesHandlers);
        }
        return options;
    }

    /**
     * adds extra defaults related ComponentConfigurator
     *
     * @param {ComponentConfiguratorFn} componentConfiguratorFn
     * @return {AbstractComponentOptionsBuilder}
     */
    addConfiguratorFn(componentConfiguratorFn) {
        this._options.extraConfigurators = this._options.extraConfigurators ?? [];
        this._options.extraConfigurators.push(new FunctionComponentConfigurator(componentConfiguratorFn));
        return this;
    }

    /**
     * adds an extra StateChangesHandler
     *
     * @param {StateChangesHandler} stateChangesHandler
     */
    addStateChangeHandler(stateChangesHandler) {
        this._options.extraStateChangesHandlers = this._options.extraStateChangesHandlers ?? [];
        this._options.extraStateChangesHandlers.push(stateChangesHandler);
        return this;
    }

    /**
     * adds an extra ComponentConfigurator
     *
     * @param {ComponentConfigurator} componentConfigurator
     */
    addConfigurator(componentConfigurator) {
        this._options.extraConfigurators = this._options.extraConfigurators ?? [];
        this._options.extraConfigurators.push(componentConfigurator);
        return this;
    }

    /**
     * @param {StateInitializerProviderFn} stateInitializerProviderFn
     */
    withStateInitializerFn(stateInitializerProviderFn) {
        return this.addConfiguratorFn((component) => {
            component.stateInitializer = stateInitializerProviderFn(component);
        });
    }

    /**
     * @param {BagConsumer} optionsConsumer
     */
    withOptionsConsumer(optionsConsumer) {
        optionsConsumer(this._options)
        return this;
    }
}

/**
 * adds extra defaults related ComponentConfigurator
 *
 * @param {ComponentConfiguratorFn} componentConfiguratorFn
 * @return {AbstractComponentOptionsBuilder}
 */
export function addConfiguratorFn(componentConfiguratorFn) {
    return new AbstractComponentOptionsBuilder().addConfiguratorFn(componentConfiguratorFn);
}

/**
 * adds an extra StateChangesHandler
 *
 * @param {StateChangesHandler} stateChangesHandler
 * @return {AbstractComponentOptionsBuilder}
 */
export function addStateChangeHandler(stateChangesHandler) {
    return new AbstractComponentOptionsBuilder().addStateChangeHandler(stateChangesHandler);
}

/**
 * adds an extra ComponentConfigurator
 *
 * @param {ComponentConfigurator} configurator
 */
export function addConfigurator(configurator) {
    return new AbstractComponentOptionsBuilder().addConfigurator(configurator);
}

/**
 * @param {StateInitializerProviderFn} stateInitializerProviderFn
 */
export function withStateInitializerFn(stateInitializerProviderFn) {
    return new AbstractComponentOptionsBuilder().withStateInitializerFn(stateInitializerProviderFn);
}

class FunctionComponentConfigurator extends ComponentConfigurator {
    componentConfiguratorFn;

    constructor(componentConfiguratorFn) {
        super();
        this.componentConfiguratorFn = componentConfiguratorFn;
    }

    configure(component) {
        this.componentConfiguratorFn(component);
    }
}