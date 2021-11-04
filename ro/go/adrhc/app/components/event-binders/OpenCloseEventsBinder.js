import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {activate, deactivate} from "../../../html-puppeteer/util/DomUtils.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-open="click" data-owner="componentId">Open</button>
        this._attachEventsHandlerToOwnedHavingDataAttr("open", undefined, () => {
            deactivate(this._$ownedHavingDataAttr("open"));
            activate(this._$ownedHavingDataAttr("close"));
            this._component.render();
        }, true);
        // <button data-close="click" data-owner="componentId">Close</button>
        this._attachEventsHandlerToOwnedHavingDataAttr("close", undefined, () => {
            deactivate(this._$ownedHavingDataAttr("close"));
            activate(this._$ownedHavingDataAttr("open"));
            this._component.close();
        }, true);
    }
}