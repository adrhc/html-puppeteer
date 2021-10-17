import ComponentConfigurator from "../configurator/ComponentConfigurator.js";
import EventsBinderGroup from "../events-binder/EventsBinderGroup.js";
import {pushNotNullMissing} from "../../../util/ArrayUtils.js";

/**
 * @typedef {function(options: ComponentOptions)} ComponentOptionsConsumer
 */
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
 * @typedef {ComponentConfigField | SimpleContainerComponentOptions & DebuggerOptions} ComponentOptions
 */
export class ComponentOptionsBuilder {
    /**
     * @type {ComponentOptions}
     */
    _options = {};
    /**
     * @type {ComponentOptions}
     */
    defaults;

    /**
     * @param {ComponentOptions} defaults will be added after this._options (only for array types, e.g. extraConfigurators).
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
     * this._options will be added after "options" param (only for array types, e.g. extraConfigurators)
     *
     * @param {ComponentOptions=} options
     * @return {ComponentOptions}
     */
    to(options = {}) {
        // extraStateChangesHandlers
        const extraStateChangesHandlers = [
            ...(options.extraStateChangesHandlers ?? []), // these come from "this"
            ...(this._options.extraStateChangesHandlers ?? []), // these are added by "this"
            ...(this.defaults.extraStateChangesHandlers ?? []), // these come from the descendant class
        ];
        // extraConfigurators
        const extraConfigurators = [
            ...(options.extraConfigurators ?? []), // these come from "this"
            ...(this._options.extraConfigurators ?? []), // these are added by "this"
            ...(this.defaults.extraConfigurators ?? []), // these come from the descendant class
        ];
        // events binders
        const eventsBinders = pushNotNullMissing([],
            this._options.eventsBinder, this._options.eventsBinder, this.defaults.eventsBinder);
        const eventsBinder = eventsBinders.length > 1 ? new EventsBinderGroup(undefined, eventsBinders) : eventsBinders[0];
        // final options
        return _.defaults({
            extraConfigurators,
            extraStateChangesHandlers,
            eventsBinder
        }, this._options, options, this.defaults);
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
            this._options.eventsBinder.addEventsBinder(...eventsBinders);
        } else {
            this._options.eventsBinder = new EventsBinderGroup(undefined, eventsBinders);
        }
        return this;
    }

    /**
     * Useful when on has to also check the current this._options values.
     *
     * @param {ComponentOptionsConsumer} optionsConsumer
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