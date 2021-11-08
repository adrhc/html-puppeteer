import {DomEventsAttachBuilder} from "./DomEventsAttachBuilder.js";

export default class EventsBinderBuilder {
    /**
     * @type {DomEventsAttachBuilder[]}
     */
    domEventsAttachBuilders = [];

    /**
     * @param {DomEventsAttachBuilder} domEventsAttachBuilder
     */
    addDomEventsAttachBuilder(domEventsAttachBuilder) {
        this.domEventsAttachBuilders.push(domEventsAttachBuilder);
        return this;
    }

    /**
     * @return {EventsBinderProviderFn}
     */
    buildEventsBinderProvider() {
        return (component) => {
            const evBinder = {};
            this.domEventsAttachBuilders.forEach(it => it.useComponent(component));
            evBinder.attachEventHandlers = attachEventHandlersFnOf(this.domEventsAttachBuilders);
            evBinder.detachEventHandlers = detachEventHandlersFnOf(this.domEventsAttachBuilders);
        };
    }
}

/**
 * @return {ChainedDomEventsAttachBuilder}
 */
export function eventsBinder() {
    return new ChainedDomEventsAttachBuilder(new EventsBinderBuilder());
}

class ChainedDomEventsAttachBuilder extends DomEventsAttachBuilder {
    /**
     * @type {EventsBinderBuilder}
     */
    chain;

    constructor(chain) {
        super();
        this.chain = chain;
    }

    and() {
        this.chain.addDomEventsAttachBuilder(this);
        return this.chain;
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
 * @return {(function(): void)}
 */
function detachEventHandlersFnOf(domEventsAttachBuilders) {
    return () => {
        domEventsAttachBuilders.map(it => it.buildDetachFn()).forEach(detachFn => detachFn());
    }
}