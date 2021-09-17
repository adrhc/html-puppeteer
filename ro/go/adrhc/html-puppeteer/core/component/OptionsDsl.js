import ComponentConfigurator from "../ComponentConfigurator.js";

/**
 * @typedef {function(component: AbstractComponent): StateInitializer} StateInitializerProviderFn
 */
/**
 * @typedef {function(component: AbstractComponent)} SetComponentDefaultsFn
 */
export class OptionsDsl {
    /**
     * AbstractComponentOptions
     */
    options = {};

    /**
     * @param {AbstractComponentOptions=} options
     */
    to(options = {}) {
        if (this.options.extraConfigurators) {
            options.extraConfigurators = options.extraConfigurators ?? [];
            options.extraConfigurators.push(...this.options.extraConfigurators);
        }
        if (this.options.extraStateChangesHandlers) {
            options.extraStateChangesHandlers = options.extraStateChangesHandlers ?? [];
            options.extraStateChangesHandlers.push(...this.options.extraStateChangesHandlers);
        }
        return options;
    }

    /**
     * adds extra defaults related ComponentConfigurator
     *
     * @param {SetComponentDefaultsFn} setComponentDefaultsFn
     * @return {OptionsDsl}
     */
    addDefaultsOf(setComponentDefaultsFn) {
        this.options.extraConfigurators = this.options.extraConfigurators ?? [];
        this.options.extraConfigurators.push(defaultsConfiguratorOf(setComponentDefaultsFn));
        return this;
    }

    /**
     * adds an extra StateChangesHandler
     *
     * @param {StateChangesHandler} stateChangesHandler
     */
    addStateChangeHandler(stateChangesHandler) {
        this.options.extraStateChangesHandlers = this.options.extraStateChangesHandlers ?? [];
        this.options.extraStateChangesHandlers.push(stateChangesHandler);
        return this;
    }

    /**
     * adds an extra ComponentConfigurator
     *
     * @param {ComponentConfigurator} configurator
     */
    addConfigurator(configurator) {
        this.options.extraConfigurators = this.options.extraConfigurators ?? [];
        this.options.extraConfigurators.push(configurator);
        return this;
    }

    /**
     * @param {StateInitializerProviderFn} stateInitializerProviderFn
     */
    setStateInitializerOf(stateInitializerProviderFn) {
        return addDefaultsOf((component) => {
            component.stateInitializer = stateInitializerProviderFn(component);
        });
    }
}

/**
 * adds extra defaults related ComponentConfigurator
 *
 * @param {SetComponentDefaultsFn} setComponentDefaultsFn
 * @return {OptionsDsl}
 */
export function addDefaultsOf(setComponentDefaultsFn) {
    return new OptionsDsl().addDefaultsOf(setComponentDefaultsFn);
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
    return new OptionsDsl().addConfigurator(stateChangesHandler);
}

/**
 * @param {StateInitializerProviderFn} stateInitializerProviderFn
 */
export function setStateInitializerOf(stateInitializerProviderFn) {
    return new OptionsDsl().setStateInitializerOf(stateInitializerProviderFn);
}

/**
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {DefaultsComponentConfigurator}
 */
function defaultsConfiguratorOf(setComponentDefaultsFn) {
    return new DefaultsComponentConfigurator(setComponentDefaultsFn);
}

class DefaultsComponentConfigurator extends ComponentConfigurator {
    setComponentDefaultsFn;

    constructor(setComponentDefaultsFn) {
        super();
        this.setComponentDefaultsFn = setComponentDefaultsFn;
    }

    _setComponentDefaults(component) {
        this.setComponentDefaultsFn(component);
    }
}