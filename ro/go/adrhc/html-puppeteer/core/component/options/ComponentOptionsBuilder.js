import ComponentConfigurator from "../configurator/ComponentConfigurator.js";

/**
 * @typedef {function(componentConfig: ComponentIllustratorOptions, parentId: string): ComponentIllustrator} ComponentIllustratorProviderFn
 */
/**
 * @typedef {function(component: AbstractComponent): StateInitializer} StateInitializerProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */
/**
 * @typedef {AbstractComponentOptions & ComponentIllustratorOptions & DebuggerOptions} ComponentOptions
 */
export class ComponentOptionsBuilder {
    /**
     * @type {Bag}
     */
    _options = {};

    /**
     * @return {ComponentOptions}
     */
    options() {
        return this.to();
    }

    /**
     * This is the equivalent of the build() method of a builder.
     *
     * @param {ComponentOptions=} options
     * @return {ComponentOptions}
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
        // prefer to keep the options value if the one from _options is missing
        options.viewProviderFn = this._options.viewProviderFn ?? options.viewProviderFn;
        return options;
    }

    /**
     * adds extra defaults related ComponentConfigurator
     *
     * @param {ComponentConfiguratorFn} componentConfiguratorFn
     * @return {ComponentOptionsBuilder}
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
     * @return {ComponentOptionsBuilder}
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
     * @return {ComponentOptionsBuilder}
     */
    addConfigurator(componentConfigurator) {
        this._options.extraConfigurators = this._options.extraConfigurators ?? [];
        this._options.extraConfigurators.push(componentConfigurator);
        return this;
    }

    /**
     * @param {ComponentIllustratorProviderFn} componentIllustratorProviderFn
     * @return {ComponentOptionsBuilder}
     */
    addComponentIllustratorProvider(componentIllustratorProviderFn) {
        this.addConfiguratorFn((component) => {
            const componentIllustrator = componentIllustratorProviderFn(component.config, component.id);
            component.stateChangesHandlersInvoker.appendStateChangesHandlers(componentIllustrator);
        });
        return this;
    }

    /**
     * @param {StateInitializerProviderFn} stateInitializerProviderFn
     * @param {boolean} useIfMissing
     * @return {ComponentOptionsBuilder}
     */
    withStateInitializerFn(stateInitializerProviderFn, useIfMissing) {
        return this.addConfiguratorFn((component) => {
            if (useIfMissing && component.stateInitializer) {
                return;
            }
            component.stateInitializer = stateInitializerProviderFn(component);
        });
    }

    /**
     * Useful when on has to also check the current this._options values.
     *
     * @param {BagConsumer} optionsConsumer
     * @return {ComponentOptionsBuilder}
     */
    withOptionsConsumer(optionsConsumer) {
        optionsConsumer(this._options)
        return this;
    }

    /**
     * @param {ViewProviderFn} viewProviderFn
     * @return {ComponentOptionsBuilder}
     */
    withViewProvider(viewProviderFn) {
        this._options.viewProviderFn = viewProviderFn;
        return this;
    }
}

/**
 * @param {ViewProviderFn} viewProviderFn
 * @return {ComponentOptionsBuilder}
 */
export function withViewProvider(viewProviderFn) {
    return new ComponentOptionsBuilder().withViewProvider(viewProviderFn);
}

/**
 * @param {ComponentIllustratorProviderFn} componentIllustratorProviderFn
 * @return {ComponentOptionsBuilder}
 */
export function addComponentIllustratorProvider(componentIllustratorProviderFn) {
    return new ComponentOptionsBuilder().addComponentIllustratorProvider(componentIllustratorProviderFn);
}

/**
 * adds extra defaults related ComponentConfigurator
 *
 * @param {ComponentConfiguratorFn} componentConfiguratorFn
 * @return {ComponentOptionsBuilder}
 */
export function addConfiguratorFn(componentConfiguratorFn) {
    return new ComponentOptionsBuilder().addConfiguratorFn(componentConfiguratorFn);
}

/**
 * adds an extra StateChangesHandler
 *
 * @param {StateChangesHandler} stateChangesHandler
 * @return {ComponentOptionsBuilder}
 */
export function addStateChangeHandler(stateChangesHandler) {
    return new ComponentOptionsBuilder().addStateChangeHandler(stateChangesHandler);
}

/**
 * adds an extra ComponentConfigurator
 *
 * @param {ComponentConfigurator} configurator
 */
export function addConfigurator(configurator) {
    return new ComponentOptionsBuilder().addConfigurator(configurator);
}

/**
 * @param {StateInitializerProviderFn} stateInitializerProviderFn
 * @param {boolean} useIfMissing
 * @return {ComponentOptionsBuilder}
 */
export function withStateInitializerFn(stateInitializerProviderFn, useIfMissing) {
    return new ComponentOptionsBuilder().withStateInitializerFn(stateInitializerProviderFn, useIfMissing);
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