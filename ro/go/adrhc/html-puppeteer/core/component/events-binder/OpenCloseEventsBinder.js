import EventsBinder from "./EventsBinder.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-open="click" data-owner="componentId">Open</button>
        this._attachHandlerByDataAttrib("open", () => {
            this._$ownedElem("open").addClass("disabled");
            this._$ownedElem("close").removeClass("disabled");
            this.component.render();
        }, true);
        // <button data-close="click" data-owner="componentId">Close</button>
        this._attachHandlerByDataAttrib("close", () => {
            this._$ownedElem("close").addClass("disabled");
            this._$ownedElem("open").removeClass("disabled");
            this.component.close();
        }, true);
    }
}