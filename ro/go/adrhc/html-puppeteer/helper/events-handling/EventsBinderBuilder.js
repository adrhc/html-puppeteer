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

    /*attachHandlers() {
        this.domEventsAttachBuilders.forEach(it => it.do());
        return this;
    }*/
}

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
