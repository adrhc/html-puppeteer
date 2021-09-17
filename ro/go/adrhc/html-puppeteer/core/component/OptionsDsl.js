import ComponentConfigurator from "../ComponentConfigurator.js";

/**
 * @typedef {function(component: AbstractComponent): StateInitializer} StateInitializerProviderFn
 */
/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */
export class OptionsDsl {
    /**
     * AbstractComponentOptions
     */
    _options = {};

    options() {
        return this.to();
    }

    /**
     * @param {AbstractComponentOptions=} options
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
     * @return {OptionsDsl}
     */
    addConfiguratorOf(componentConfiguratorFn) {
        this._options.extraConfigurators = this._options.extraConfigurators ?? [];
        this._options.extraConfigurators.push(componentConfiguratorOf(componentConfiguratorFn));
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
     * @param {ComponentConfigurator} configurator
     */
    addConfigurator(configurator) {
        this._options.extraConfigurators = this._options.extraConfigurators ?? [];
        this._options.extraConfigurators.push(configurator);
        return this;
    }

    /**
     * @param {StateInitializerProviderFn} stateInitializerProviderFn
     */
    withStateInitializerOf(stateInitializerProviderFn) {
        return this.addConfiguratorOf((component) => {
            component.stateInitializer = stateInitializerProviderFn(component);
        });
    }
}

/**
 * adds extra defaults related ComponentConfigurator
 *
 * @param {ComponentConfiguratorFn} componentConfiguratorFn
 * @return {OptionsDsl}
 */
export function addConfiguratorOf(componentConfiguratorFn) {
    return new OptionsDsl().addConfiguratorOf(componentConfiguratorFn);
}

/**
 * adds an extra StateChangesHandler
 *
 * @param {StateChangesHandler} stateChangesHandler
 * @return {OptionsDsl}
 */
export function addStateChangeHandler(stateChangesHandler) {
    return new OptionsDsl().addStateChangeHandler(stateChangesHandler);
}

/**
 * adds an extra ComponentConfigurator
 *
 * @param {ComponentConfigurator} configurator
 */
export function addConfigurator(configurator) {
    return new OptionsDsl().addConfigurator(configurator);
}

/**
 * @param {StateInitializerProviderFn} stateInitializerProviderFn
 */
export function withStateInitializerOf(stateInitializerProviderFn) {
    return new OptionsDsl().withStateInitializerOf(stateInitializerProviderFn);
}

/**
 * @param {ComponentConfiguratorFn} componentConfiguratorFn
 * @return {DelegatingComponentConfigurator}
 */
function componentConfiguratorOf(componentConfiguratorFn) {
    return new DelegatingComponentConfigurator(componentConfiguratorFn);
}

class DelegatingComponentConfigurator extends ComponentConfigurator {
    componentConfiguratorFn;

    constructor(componentConfiguratorFn) {
        super();
        this.componentConfiguratorFn = componentConfiguratorFn;
    }

    configure(component) {
        this.componentConfiguratorFn(component);
    }
}