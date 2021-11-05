import EventsBinderGroup from "../events-binder/EventsBinderGroup.js";
import {pushNotNullMissing} from "../../../util/ArrayUtils.js";
import {FunctionComponentConfigurator} from "./FunctionComponentConfigurator.js";

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
     * @param {ComponentOptions} descendantComponentClassOptions
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
     * Descendant classes options should override everything (aka have 1th priority).
     * current*Options usually is just an alternative way of passing
     * descendant classes options that's why should have 2nd priority.
     * builderOptions are set by base classes, usually as defaults for missing values, that's why this have 3rd priority.
     *
     * @param {ComponentOptions=} currentConstructorOptions could be any constructor in a component class hierarchy
     * @return {ComponentOptions}
     */
    to(currentConstructorOptions = {}) {
        // componentIllustratorProviders
        const componentIllustratorProviders = [
            ...(this.descendantComponentClassOptions.componentIllustratorProviders ?? []),
            ...(currentConstructorOptions.componentIllustratorProviders ?? []),
            ...(this.builderOptions.componentIllustratorProviders ?? [])
        ];
        // extraStateChangesHandlers
        const extraStateChangesHandlers = [
            ...(this.descendantComponentClassOptions.extraStateChangesHandlers ?? []),
            ...(currentConstructorOptions.extraStateChangesHandlers ?? []),
            ...(this.builderOptions.extraStateChangesHandlers ?? [])
        ];
        // extraConfigurators
        const extraConfigurators = [
            ...(this.builderOptions.extraConfigurators ?? []),
            ...(currentConstructorOptions.extraConfigurators ?? []),
            // descendant classes have priority: latest might override things
            ...(this.descendantComponentClassOptions.extraConfigurators ?? [])
        ];
        // events binders
        const eventsBinders = pushNotNullMissing([], this.builderOptions.eventsBinder,
            currentConstructorOptions.eventsBinder, this.descendantComponentClassOptions.eventsBinder);
        const eventsBinder = eventsBinders.length > 1 ? new EventsBinderGroup(undefined, eventsBinders) : eventsBinders[0];
        const eventsBinderProvider = (component) => {
            const eventsBinders = pushNotNullMissing([],
                this.descendantComponentClassOptions.eventsBinderProvider,
                currentConstructorOptions.eventsBinderProvider)
                .map(evbProvider => evbProvider(component))
                .filter(it => it != null);
            eventsBinder && eventsBinders.push(eventsBinder);
            return eventsBinders.length ? new EventsBinderGroup(component, eventsBinders) : undefined;
        }
        // final options
        return _.defaults({
            extraConfigurators,
            componentIllustratorProviders,
            extraStateChangesHandlers,
            eventsBinderProvider
        }, this.descendantComponentClassOptions, currentConstructorOptions, this.builderOptions);
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
     * @param {StateChangesHandlerProviderFn} componentIllustratorProvider
     * @param {boolean=} doNothing
     * @return {ComponentOptionsBuilder}
     */
    addComponentIllustratorProvider(componentIllustratorProvider, doNothing) {
        if (doNothing) {
            return this;
        }
        if (this.builderOptions.componentIllustratorProviders) {
            this.builderOptions.componentIllustratorProviders.push(componentIllustratorProvider);
        } else {
            this.builderOptions.componentIllustratorProviders = [componentIllustratorProvider];
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
    addEventsBinders(...eventsBinders) {
        if (this.builderOptions.eventsBinder) {
            this.builderOptions.eventsBinder.addEventsBinder(...eventsBinders);
        } else {
            this.builderOptions.eventsBinder = new EventsBinderGroup(undefined, eventsBinders);
        }
        return this;
    }

    /**
     * @param {StateHolderProviderFn} stateHolderProvider
     */
    withStateHolderProvider(stateHolderProvider) {
        return this.addConfiguratorProvider(component => {
            component.stateHolder = stateHolderProvider(component)
        });
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
