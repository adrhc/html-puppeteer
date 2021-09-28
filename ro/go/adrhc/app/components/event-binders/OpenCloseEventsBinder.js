import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-open="click" data-owner="componentId">Open</button>
        this._attachEventsHandlerOnOwnedHavingDataAttr("open", () => {
            this._$ownedHavingDataAttr("open").addClass("disabled");
            this._$ownedHavingDataAttr("close").removeClass("disabled");
            this._component.render();
        }, true);
        // <button data-close="click" data-owner="componentId">Close</button>
        this._attachEventsHandlerOnOwnedHavingDataAttr("close", () => {
            this._$ownedHavingDataAttr("close").addClass("disabled");
            this._$ownedHavingDataAttr("open").removeClass("disabled");
            this._component.close();
        }, true);
    }
}