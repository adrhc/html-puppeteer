import {isTrue} from "../util/AssertionUtils.js";

export class DomEventHandlerBuilder {
    /**
     * @type {jQuery<HTMLElement>} is the element to which the event handler is bound to
     * @protected
     */
    $elem;
    /**
     * @type {string} space separated list of events to handle, e.g. "click mouseover"
     * @protected
     */
    events;
    /**
     * @type {function(ev: Event)}
     * @protected
     */
    fn;
    /**
     * @type {boolean} specify whether to handle then forget or keep the events handler bound till manually releasing it
     * @protected
     */
    oneTimeOnly;

    /**
     * @param {string[]} events
     * @return {DomEventHandlerBuilder}
     */
    whenEvents(events) {
        this.events = events.join(" ");
        return this;
    }

    /**
     * @param {jQuery<HTMLElement>} $elem
     * @return {DomEventHandlerBuilder}
     */
    occurOn($elem) {
        this.$elem = $elem;
        return this;
    }

    /**
     * @param {function(ev: Event)} fn
     * @return {DomEventHandlerBuilder}
     */
    use(fn) {
        this.fn = fn;
        return this;
    }

    /**
     * @param {boolean=} once
     * @return {DomEventHandlerBuilder}
     */
    times(once) {
        this.oneTimeOnly = once;
        return this;
    }

    toHandle() {
        this.$elem[this.oneTimeOnly ? "one" : "on"](this.events, this.fn);
    }
}

/**
 * @param {string} events
 * @return {DomEventHandlerBuilder}
 */
export function whenEvents(...events) {
    isTrue(!!events?.length, "[DomEventHandlerBuilder] events can't be empty!");
    return new DomEventHandlerBuilder().whenEvents(events);
}