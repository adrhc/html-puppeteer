import ComponentConfigurator from "../configurator/ComponentConfigurator.js";
import EventsBinderGroup from "../events-binder/EventsBinderGroup.js";

/**
 * @typedef {function(component: AbstractComponent): ComponentIllustrator} ComponentIllustratorProviderFn
 */
/**
 * @typedef {function(initialState: *): StateInitializer} StateInitializerProviderFn
 */
/**
 * @typedef {function(): EventsBinder} EventsBinderProviderFn
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
        const extraConfigurators = [
            ...(this.options.extraConfigurators ?? []), // these come from "this"
            ...(this._options.extraConfigurators ?? []), // these are added by "this"
            ...(this.defaults.extraConfigurators ?? []), // these come from the descendant class
        ];
        return _.defaults({}, {extraConfigurators}, this._options, options, this.defaults);
    }

    /**
     * adds an extra StateChangesHandler
     *
     * @param {StateChangesHandler} stateChangesHandler
     * @return {ComponentOptionsBuilder}
     */
    addStateChangeHandler(stateChangesHandler) {
        if (this._options.extraStateChangesHandlers) {
            this._options.extraStateChangesHandlers.push(stateChangesHandler);
        } else if (this.defaults.extraStateChangesHandlers) {
            this._options.extraStateChangesHandlers = [...this.defaults.extraStateChangesHandlers, stateChangesHandler];
        } else {
            this._options.extraStateChangesHandlers = [stateChangesHandler];
        }
        return this;
    }

    /**
     * adds extra defaults related ComponentConfigurator
     *
     * @param {ComponentConfiguratorFn} componentConfiguratorFn
     * @return {ComponentOptionsBuilder}
     */
    addConfiguratorFn(componentConfiguratorFn) {
        this.addConfigurator(new FunctionComponentConfigurator(componentConfiguratorFn));
        return this;
    }

    /**
     * adds an extra ComponentConfigurator
     *
     * @param {ComponentConfigurator} componentConfigurator
     * @return {ComponentOptionsBuilder}
     */
    addConfigurator(componentConfigurator) {
        if (this._options.extraConfigurators) {
            this._options.extraConfigurators.push(componentConfigurator);
        } else {
            this._options.extraConfigurators = [componentConfigurator];
        }
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
            const componentIllustrator = componentIllustratorProviderFn(component);
            component.appendStateChangesHandlers(componentIllustrator);
        });
        return this;
    }

    /**
     * @param {EventsBinder} eventsBinders
     * @return {ComponentOptionsBuilder}
     */
    withEventsBinders(...eventsBinders) {
        if (this._options.eventsBinder) {
            eventsBinders = [...eventsBinders, this._options.eventsBinder];
        } else if (this.defaults.eventsBinder) {
            eventsBinders = [...eventsBinders, this.defaults.eventsBinder];
        }
        this._options.eventsBinder = new EventsBinderGroup(undefined, eventsBinders);
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