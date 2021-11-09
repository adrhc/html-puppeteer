import {DomEventsAttachBuilder} from "./DomEventsAttachBuilder.js";

class EventsBinderBuilder {
    /**
     * @type {DomEventsAttachBuilder}
     */
    domEventsAttachBuilder;
    /**
     * @type {Set<DomEventsAttachBuilder>}
     */
    domEventsAttachBuilders = new Set();

    constructor() {
        this.domEventsAttachBuilder = new DomEventsAttachBuilder();
    }

    /**
     * @param {DomEventsAttachBuilder} domEventsAttachBuilder
     */
    addDomEventsAttachBuilder(domEventsAttachBuilder) {
        this.domEventsAttachBuilders.add(domEventsAttachBuilder);
        return this;
    }

    /**
     * @return {EventsHandlerDetachFn}
     */
    buildDetachEventsHandlersFn() {
        return detachEventHandlersFnOf(this.domEventsAttachBuilders);
    }

    /**
     * @return {EventsBinderProviderFn}
     */
    buildEventsBinderProvider() {
        return (component) => {
            const evBinder = {};
            this.domEventsAttachBuilders.forEach(domEvAttachBuilder => domEvAttachBuilder.useComponent(component));
            evBinder.attachEventHandlers = attachEventHandlersFnOf(this.domEventsAttachBuilders);
            evBinder.detachEventHandlers = this.buildDetachEventsHandlersFn();
            return /** @type {EventsBinder} */ evBinder;
        };
    }

    /**
     * @return {EventsBinderBuilder}
     */
    and() {
        this.addDomEventsAttachBuilder(this.domEventsAttachBuilder);
        this.domEventsAttachBuilder = new DomEventsAttachBuilder();
        return this;
    }

    whenEvents(...events) {
        this.domEventsAttachBuilder.whenEvents(...events);
        return this;
    }

    useComponent(component) {
        this.domEventsAttachBuilder.useComponent(component);
        return this;
    }

    occurOn($elemOrSelector) {
        this.domEventsAttachBuilder.occurOn($elemOrSelector);
        return this;
    }

    /**
     * @param {string} name
     * @param {string=} owner
     * @return {EventsBinderBuilder}
     */
    occurOnBtn(name, owner) {
        this.domEventsAttachBuilder.occurOnBtn(name, owner);
        return this;
    }

    occurOnComponent(component, useComponent = true) {
        this.domEventsAttachBuilder.occurOnComponent(component, useComponent);
        return this;
    }

    occurOnOwnedDataAttr(dataAttrName, owner, dataAttrValue) {
        this.domEventsAttachBuilder.occurOnOwnedDataAttr(dataAttrName, owner, dataAttrValue);
        return this;
    }

    triggeredBy(selector) {
        this.domEventsAttachBuilder.triggeredBy(selector);
        return this;
    }

    triggeredByOwnedDataAttr(dataAttrName, owner) {
        this.domEventsAttachBuilder.triggeredByOwnedDataAttr(dataAttrName, owner);
        return this;
    }

    useHandler(fn) {
        this.domEventsAttachBuilder.useHandler(fn);
        return this;
    }

    useHandlerProvider(fnProvider) {
        this.domEventsAttachBuilder.useHandlerProvider(fnProvider);
        return this;
    }

    once(once = true) {
        this.domEventsAttachBuilder.once(once);
        return this;
    }

    do(fn) {
        this.domEventsAttachBuilder.do(fn);
        return this;
    }

    attach() {
        this.domEventsAttachBuilder.attach();
        return this;
    }

    buildDetachFn() {
        this.domEventsAttachBuilder.buildDetachFn();
        return this;
    }
}

/**
 * @return {EventsBinderBuilder}
 */
export function eventsBinder() {
    return new EventsBinderBuilder();
}

/**
 * @param {Set<DomEventsAttachBuilder>} domEventsAttachBuilders
 * @return {(function(): void)}
 */
function attachEventHandlersFnOf(domEventsAttachBuilders) {
    return () => {
        domEventsAttachBuilders.forEach(it => it.attach());
    };
}

/**
 * @param {Set<DomEventsAttachBuilder>} domEventsAttachBuilders
 * @return {EventsHandlerDetachFn}
 */
function detachEventHandlersFnOf(domEventsAttachBuilders) {
    return () => {
        [...domEventsAttachBuilders].map(it => it.buildDetachFn()).forEach(detachFn => detachFn());
    }
}