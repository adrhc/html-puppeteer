import ComponentConfigurator from "../configurator/ComponentConfigurator.js";

/**
 * @typedef {function(componentId: string, componentIllustratorOptions: ComponentIllustratorOptions): ComponentIllustrator} ComponentIllustratorProviderFn
 */
/**
 * @typedef {function(initialState: *): StateInitializer} StateInitializerProviderFn
 */
/**
 * @typedef {function(component: AbstractComponent): EventsBinder} EventsBinderProviderFn
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
     * @type {Bag}
     */
    defaults;

    /**
     * @param {Bag} defaults
     */
    constructor(defaults = {}) {
        this.defaults = defaults;
    }

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
        return _.defaults(this.defaults, options);
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
     * @param {boolean=} addEvenWhenAComponentIllustratorExistsInDefaults
     * @return {ComponentOptionsBuilder}
     */
    addComponentIllustratorProvider(componentIllustratorProviderFn, addEvenWhenAComponentIllustratorExistsInDefaults) {
        if (!addEvenWhenAComponentIllustratorExistsInDefaults && this.defaults.componentIllustrator) {
            return this;
        }
        this.addConfiguratorFn((component) => {
            const componentIllustrator = componentIllustratorProviderFn(component.id, component.config);
            component.stateChangesHandlersInvoker.appendStateChangesHandlers(componentIllustrator);
        });
        return this;
    }

    /**
     * @param {EventsBinderProviderFn} eventsBinderProviderFn
     * @param {boolean=} overrideDefault
     * @return {ComponentOptionsBuilder}
     */
    withEventsBinder(eventsBinderProviderFn, overrideDefault) {
        if (!overrideDefault && this.defaults.eventsBinder) {
            return this;
        } else {
            this.defaults.eventsBinder = eventsBinderProviderFn();
        }
        return this;
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
}

export function withDefaults(options) {
    return new ComponentOptionsBuilder({...options});
}

/**
 * @param {EventsBinderProviderFn} eventsBinderProviderFn
 * @param {boolean=} overrideDefault
 * @return {ComponentOptionsBuilder}
 */
export function withEventsBinder(eventsBinderProviderFn, overrideDefault) {
    return new ComponentOptionsBuilder().withEventsBinder(eventsBinderProviderFn, overrideDefault);
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