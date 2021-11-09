import {DomEventsAttachBuilder} from "./DomEventsAttachBuilder.js";

/**
 * @return {EventsBinderBuilder}
 */
export function eventsBinder() {
    return new EventsBinderBuilder();
}

class EventsBinderBuilder {
    /**
     * @type {DomEventsAttachBuilder}
     */
    domEventsAttachBuilder;
    /**
     * @type {DomEventsAttachBuilder[]}
     */
    domEventsAttachBuilders = [];

    constructor() {
        this.domEventsAttachBuilder = new DomEventsAttachBuilder();
    }

    /**
     * @param {DomEventsAttachBuilder} domEventsAttachBuilder
     */
    addDomEventsAttachBuilder(domEventsAttachBuilder) {
        this.domEventsAttachBuilders.push(domEventsAttachBuilder);
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
            this.domEventsAttachBuilders.forEach(it => it.useComponent(component));
            evBinder.attachEventHandlers = attachEventHandlersFnOf(this.domEventsAttachBuilders);
            evBinder.detachEventHandlers = this.buildDetachEventsHandlersFn();
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
 * @param {DomEventsAttachBuilder[]} domEventsAttachBuilders
 * @return {(function(): void)}
 */
function attachEventHandlersFnOf(domEventsAttachBuilders) {
    return () => {
        domEventsAttachBuilders.forEach(it => it.attach());
    };
}

/**
 * @param {DomEventsAttachBuilder[]} domEventsAttachBuilders
 * @return {EventsHandlerDetachFn}
 */
function detachEventHandlersFnOf(domEventsAttachBuilders) {
    return () => {
        domEventsAttachBuilders.map(it => it.buildDetachFn()).forEach(detachFn => detachFn());
    }
}