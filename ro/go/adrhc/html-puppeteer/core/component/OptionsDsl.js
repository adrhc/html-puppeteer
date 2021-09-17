import {defaultsConfiguratorOf} from "../ComponentConfigurator.js";

/**
 * @typedef {function(component: AbstractComponent)} SetComponentDefaultsFn
 */
export class OptionsDsl {
    /**
     * AbstractComponentOptions
     */
    options = {};

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
     * adds an extra ComponentConfigurator
     *
     * @param {ComponentConfigurator} configurator
     */
    addConfigurator(configurator) {
        this.options.extraConfigurators = this.options.extraConfigurators ?? [];
        this.options.extraConfigurators.push(configurator);
        return this;
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