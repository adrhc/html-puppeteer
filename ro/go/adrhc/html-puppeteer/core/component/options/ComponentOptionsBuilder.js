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
        const eventsBinders = pushNotNullMissing([],
            currentConstructorOptions.eventsBinder, this.builderOptions.eventsBinder, this.descendantComponentClassOptions.eventsBinder);
        const eventsBinder = eventsBinders.length > 1 ? new EventsBinderGroup(undefined, eventsBinders) : eventsBinders[0];
        // final options
        return _.defaults({
            extraConfigurators,
            extraStateChangesHandlers,
            eventsBinder
        }, this.builderOptions, currentConstructorOptions, this.descendantComponentClassOptions);
    }

    /**
     * adds an extra StateChangesHandler
     *
     * @param {StateChangesHandler} stateChangesHandler
     * @return {ComponentOptionsBuilder}
     */
    addStateChangeHandler(stateChangesHandler) {
        if (this.builderOptions.extraStateChangesHandlers) {
            this.builderOptions.extraStateChangesHandlers.push(stateChangesHandler);
        } else {
            this.builderOptions.extraStateChangesHandlers = [stateChangesHandler];
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
        if (this.builderOptions.extraConfigurators) {
            this.builderOptions.extraConfigurators.push(componentConfigurator);
        } else {
            this.builderOptions.extraConfigurators = [componentConfigurator];
        }
        return this;
    }

    /**
     * @param {ComponentIllustratorProviderFn} componentIllustratorProviderFn
     * @param {boolean=} addEvenWhenAComponentIllustratorExistsInDefaults
     * @return {ComponentOptionsBuilder}
     */
    addComponentIllustratorProvider(componentIllustratorProviderFn, addEvenWhenAComponentIllustratorExistsInDefaults) {
        if (!addEvenWhenAComponentIllustratorExistsInDefaults && this.descendantComponentClassOptions.componentIllustrator) {
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
        optionsConsumer(this.builderOptions)
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