import {eventsBinder} from "../../../html-puppeteer/helper/events-handling/EventsBinderBuilder.js";
import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";

export default class UpdatableSwitchEventsBinder extends EventsBinder {
    /**
     * @return {SwitcherComponent}
     */
    get switcherComponent() {
        return /** @type {SwitcherComponent} */ this.component.parent;
    }

    /**
     * attaches all necessary DOM event handlers
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            // <button data-child-id="childId" data-owner="componentId" data-remove-child />
            .whenEvents("click")
            .occurOnOwnedDataAttr("update-child", this.switcherComponent.id)
            .do(() => {
                alert("Not implemented!");
            })
            .and()
            .buildDetachEventsHandlersFn();
    }
}