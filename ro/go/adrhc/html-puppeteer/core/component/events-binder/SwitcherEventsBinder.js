import AbstractContainerEventsBinder from "./AbstractContainerEventsBinder.js";
import {eventsBinder} from "../../../helper/events-handling/EventsBinderBuilder.js";

export default class SwitcherEventsBinder extends AbstractContainerEventsBinder {
    /**
     * @type {string}
     */
    switchDataAttr;
    /**
     * @type {string}
     */
    switchEvent;

    /**
     * @return {SwitcherComponent}
     */
    get switcherComponent() {
        return /** @type {SwitcherComponent} */ this.component;
    }

    /**
     * @param {AbstractComponent=} component
     * @param {string=} switchEvent
     * @param {string=} switchDataAttr
     */
    constructor(component, switchEvent, switchDataAttr) {
        super(component);
        this.switchEvent = switchEvent ?? "click";
        this.switchDataAttr = switchDataAttr ?? "switch-to";
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            .whenEvents(this.switchEvent)
            .occurOnComponent(this.component)
            .triggeredByOwnedDataAttr(this.switchDataAttr)
            .do(ev => {
                const $elem = $(ev.target)
                const switchTo = $elem.data(this.switchDataAttr);
                this.switcherComponent.switchTo(switchTo);
            })
            .and()
            .buildDetachEventsHandlersFn();
    }
}
