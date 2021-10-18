import EventsBinderGroup from "../events-binder/EventsBinderGroup.js";
import {pushNotNullMissing} from "../../../util/ArrayUtils.js";
import {FunctionComponentConfigurator} from "./FunctionComponentConfigurator.js";

/**
 * @typedef {function(options: AbstractComponent): StateChangesHandler} StateChangesHandlerProviderFn
 */
/**
 * @typedef {function(options: ComponentOptions)} ComponentOptionsConsumer
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
 * @typedef {ComponentConfigField | BasicContainerComponentOptions & DebuggerOptions} ComponentOptions
 */
export class ComponentOptionsBuilder {
    /**
     * @type {ComponentOptions}
     */
    builderOptions = {};
    /**
     * these should come from the descendant class
     *
     * @type {ComponentOptions}
     */
    descendantComponentClassOptions;

    /**
     * @param {ComponentOptions} descendantComponentClassOptions will be added after this.builderOptions (only for array types, e.g. extraConfigurators).
     */
    constructor(descendantComponentClassOptions = {}) {
        this.descendantComponentClassOptions = descendantComponentClassOptions;
    }

    /**
     * @return {ComponentOptions}
     */
    options() {
        return this.to();
    }

    /**
     * this.builderOptions will be added after "options" param (only for array types, e.g. extraConfigurators)
     *
     * @param {ComponentOptions=} currentConstructorOptions could be any constructor in a component class hierarchy
     * @return {ComponentOptions}
     */
    to(currentConstructorOptions = {}) {
        // extraStateChangesHandlers
        const extraStateChangesHandlers = [
            ...(currentConstructorOptions.extraStateChangesHandlers ?? []),
            ...(this.builderOptions.extraStateChangesHandlers ?? []),
            ...(this.descendantComponentClassOptions.extraStateChangesHandlers ?? [])
        ];
        // extraConfigurators
        const extraConfigurators = [
            ...(currentConstructorOptions.extraConfigurators ?? []),
            ...(this.builderOptions.extraConfigurators ?? []),
            ...(this.descendantComponentClassOptions.extraConfigurators ?? [])
        ];
        // events binders
        const eventsBinders = pushNotNullMissing([], currentConstructorOptions.eventsBinder,
            this.builderOptions.eventsBinder, this.descendantComponentClassOptions.eventsBinder);
        const eventsBinder = eventsBinders.length > 1 ? new EventsBinderGroup(undefined, eventsBinders) : eventsBinders[0];
        const eventsBinderProvider = eventsBinder ? (component) => {
            eventsBinder.component = component;
            return eventsBinder;
        } : undefined;
        // final options
        return _.defaults({
            extraConfigurators,
            extraStateChangesHandlers,
            eventsBinderProvider
        }, this.builderOptions, currentConstructorOptions, this.descendantComponentClassOptions);
    }

    /**
     * adds an extra StateChangesHandler
     *
     * @param {StateChangesHandler} stateChangesHandler
     * @return {ComponentOptionsBuilder}
     */
    addStateChangesHandler(stateChangesHandler) {
        if (this.builderOptions.extraStateChangesHandlers) {
            this.builderOptions.extraStateChangesHandlers.push(stateChangesHandler);
        } else {
            this.builderOptions.extraStateChangesHandlers = [stateChangesHandler];
        }
        return this;
    }

    /**
     * @param {StateChangesHandlerProviderFn} stateChangesHandlerProvider
     */
    addStateChangesHandlerProvider(stateChangesHandlerProvider) {
        return this.addConfiguratorProvider((component) => {
            const stateChangesHandler = stateChangesHandlerProvider(component);
            component.appendStateChangesHandlers(stateChangesHandler);
        });
    }

    /**
     * adds extra defaults related ComponentConfigurator
     *
     * @param {ComponentConfiguratorFn} componentConfiguratorFn
     * @return {ComponentOptionsBuilder}
     */
    addConfiguratorProvider(componentConfiguratorFn) {
        return this.addConfigurator(new FunctionComponentConfigurator(componentConfiguratorFn));
    }

    /**
     * adds an extra ComponentConfigurator
     *
     * @param {ComponentConfigurator} componentConfigurator
     * @return {ComponentOptionsBuilder}
     */
    addConfigurator(componentConfigurator) {
        if (this.builderOptions.extraConfigurators) {
            this.builderOptions.extraConfigurators.push(componentConfigurator);
        } else {
            this.builderOptions.extraConfigurators = [componentConfigurator];
        }
        return this;
    }

    /**
     * @param {EventsBinder} eventsBinders
     * @return {ComponentOptionsBuilder}
     */
    withEventsBinders(...eventsBinders) {
        if (this.builderOptions.eventsBinder) {
            this.builderOptions.eventsBinder.addEventsBinder(...eventsBinders);
        } else {
            this.builderOptions.eventsBinder = new EventsBinderGroup(undefined, eventsBinders);
        }
        return this;
    }

    /**
     * Useful when on has to also check the current this.builderOptions values.
     *
     * @param {ComponentOptionsConsumer} optionsConsumer
     * @return {ComponentOptionsBuilder}
     */
    withOptionsConsumer(optionsConsumer) {
        optionsConsumer(this.builderOptions);
        return this;
    }
}

export function withDefaults(options) {
    return new ComponentOptionsBuilder({...options});
}

/**
 * @param {StateChangesHandlerProviderFn} stateChangesHandlerProviderFn
 * @return {ComponentOptionsBuilder}
 */
export function addStateChangesHandlerProvider(stateChangesHandlerProviderFn) {
    return new ComponentOptionsBuilder().addStateChangesHandlerProvider(stateChangesHandlerProviderFn);
}

/**
 * adds extra defaults related ComponentConfigurator
 *
 * @param {ComponentConfiguratorFn} componentConfiguratorFn
 * @return {ComponentOptionsBuilder}
 */
export function addConfiguratorProvider(componentConfiguratorFn) {
    return new ComponentOptionsBuilder().addConfiguratorProvider(componentConfiguratorFn);
}

/**
 * adds an extra StateChangesHandler
 *
 * @param {StateChangesHandler} stateChangesHandler
 * @return {ComponentOptionsBuilder}
 */
export function addStateChangesHandler(stateChangesHandler) {
    return new ComponentOptionsBuilder().addStateChangesHandler(stateChangesHandler);
}

/**
 * adds an extra ComponentConfigurator
 *
 * @param {ComponentConfigurator} configurator
 */
export function addConfigurator(configurator) {
    return new ComponentOptionsBuilder().addConfigurator(configurator);
}
