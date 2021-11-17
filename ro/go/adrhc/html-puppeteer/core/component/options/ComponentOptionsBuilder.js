import {FunctionComponentConfigurator} from "./FunctionComponentConfigurator.js";
import {eventsBinderProviderFnOf} from "../../../util/Types.js";

/**
 * @typedef {ComponentOptions} ComponentOptionsBuilderOptions
 * @property {EventsBinderProviderFn[]} eventsBinderProviders
 * @property {ChildrenCollectionProviderFn} childrenCollectionProvider
 */
export class ComponentOptionsBuilder {
    /**
     * @type {ComponentOptionsBuilderOptions}
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
        const componentIllustratorProviders = undefinedIfEmpty([
            ...(this.descendantComponentClassOptions.componentIllustratorProviders ?? []),
            ...(currentConstructorOptions.componentIllustratorProviders ?? []),
            ...(this.builderOptions.componentIllustratorProviders ?? [])
        ]);
        // extraStateChangesHandlers
        const extraStateChangesHandlers = undefinedIfEmpty([
            ...(this.descendantComponentClassOptions.extraStateChangesHandlers ?? []),
            ...(currentConstructorOptions.extraStateChangesHandlers ?? []),
            ...(this.builderOptions.extraStateChangesHandlers ?? [])
        ]);
        // extraConfigurators
        const extraConfigurators = undefinedIfEmpty([
            ...(this.builderOptions.extraConfigurators ?? []),
            ...(currentConstructorOptions.extraConfigurators ?? []),
            // descendant classes have priority: latest might override things
            ...(this.descendantComponentClassOptions.extraConfigurators ?? [])
        ]);
        // events binders: all provided are used
        const eventsBinderProviders = undefinedIfEmpty([
            ...(this.builderOptions.eventsBinderProviders ?? []),
            ...(currentConstructorOptions.eventsBinderProviders ?? []),
            ...(this.descendantComponentClassOptions.eventsBinderProviders ?? [])
        ]);
        // stateHolderProvider using default priority: descendant, current-constructor, builder
        const stateHolderProvider = this.descendantComponentClassOptions.stateHolderProvider ??
            currentConstructorOptions.stateHolderProvider ?? this.builderOptions.stateHolderProvider;
        // childrenCollectionProvider using default priority: descendant, current-constructor, builder
        const childrenCollectionProvider = this.descendantComponentClassOptions.childrenCollectionProvider ??
            currentConstructorOptions.childrenCollectionProvider ?? this.builderOptions.childrenCollectionProvider;
        // childrenCollectionProvider using default priority: descendant, current-constructor, builder
        const $elem = this.descendantComponentClassOptions.$elem ??
            currentConstructorOptions.$elem ?? this.builderOptions.$elem;
        // options building
        return _.defaults({
            extraConfigurators,
            componentIllustratorProviders,
            extraStateChangesHandlers,
            eventsBinderProviders,
            stateHolderProvider,
            childrenCollectionProvider,
            $elem
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
     * @param {EventsBinder|EventsBinderProviderFn} eventsBinderOrProviders
     * @return {ComponentOptionsBuilder}
     */
    addEventsBinders(...eventsBinderOrProviders) {
        const eventsBinderProviders = eventsBinderOrProviders
            .map(it => typeof it === "function" ? it : eventsBinderProviderFnOf(it));
        this.builderOptions.eventsBinderProviders ??= [];
        this.builderOptions.eventsBinderProviders.push(...eventsBinderProviders);
        return this;
    }

    /**
     * @param {ElemIdOrJQuery} $elem
     */
    withElem($elem) {
        this.builderOptions.$elem = $elem;
        return this;
    }

    /**
     * @param {StateHolderProviderFn} stateHolderProvider
     */
    withStateHolderProvider(stateHolderProvider) {
        this.builderOptions.stateHolderProvider = stateHolderProvider;
        return this;
    }

    /**
     * @param {ChildrenCollectionProviderFn} childrenCollectionProvider
     */
    withChildrenCollectionProvider(childrenCollectionProvider) {
        this.builderOptions.childrenCollectionProvider = childrenCollectionProvider;
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

function undefinedIfEmpty(array) {
    return array.length ? array : undefined;
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
 * @return {ComponentOptionsBuilder}
 */
export function addConfigurator(configurator) {
    return new ComponentOptionsBuilder().addConfigurator(configurator);
}

/**
 * @param {ElemIdOrJQuery} $elem will go into SimpleView.$elem
 * @return {ComponentOptionsBuilder}
 */
export function withElem($elem) {
    return new ComponentOptionsBuilder().withElem($elem);
}