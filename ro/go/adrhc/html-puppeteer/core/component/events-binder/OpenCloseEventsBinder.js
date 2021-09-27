import EventsBinder from "./EventsBinder.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-open="click" data-owner="componentId">Open</button>
        this._attachChildEventsHandler("open", () => {
            this._$childrenHavingDataAttr("open").addClass("disabled");
            this._$childrenHavingDataAttr("close").removeClass("disabled");
            this._component.render();
        }, true);
        // <button data-close="click" data-owner="componentId">Close</button>
        this._attachChildEventsHandler("close", () => {
            this._$childrenHavingDataAttr("close").addClass("disabled");
            this._$childrenHavingDataAttr("open").removeClass("disabled");
            this._component.close();
        }, true);
    }
}