import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {activate, deactivate} from "../../../html-puppeteer/util/DomUtils.js";
import {when} from "../../../html-puppeteer/helper/events-handling/DomEventsAttachBuilder.js";
import {dataAttrValueOfOwnedDataAttr, elemOfOwnedDataAttr} from "../../../html-puppeteer/helper/CSSSelectorBuilder.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * @type {string}
     */
    closeDataAttrName;
    /**
     * @type {string}
     */
    openDataAttrName;

    /**
     * @param {string=} [closeDataAttrName="close"]
     * @param {string=} [openDataAttrName="open"]
     * @param {AbstractComponent=} component
     */
    constructor(closeDataAttrName = "close", openDataAttrName = "open", component) {
        super(component);
        this.closeDataAttrName = closeDataAttrName;
        this.openDataAttrName = openDataAttrName;
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-open data-owner="componentId">Open</button>
        let eventName = this._eventNameOfOwnedDataAttr(this.openDataAttrName);
        when(eventName).occurOnOwnedDataAttr(this.openDataAttrName, this.componentId)
            .once().do(() => {
            this._deactivateOwnedDataAttr(this.openDataAttrName);
            this._activateOwnedDataAttr(this.closeDataAttrName);
            this._component.render();
        });
        // <button data-close data-owner="componentId">Close</button>
        eventName = this._eventNameOfOwnedDataAttr(this.closeDataAttrName);
        when(eventName).occurOnOwnedDataAttr(this.closeDataAttrName, this.componentId)
            .once().do(() => {
            this._deactivateOwnedDataAttr(this.closeDataAttrName);
            this._activateOwnedDataAttr(this.openDataAttrName);
            this._component.close();
        });
    }

    /**
     * @param {string} attrName
     * @return {string|number|boolean}
     * @protected
     */
    _eventNameOfOwnedDataAttr(attrName) {
        return dataAttrValueOfOwnedDataAttr(this.componentId, attrName);
    }

    /**
     * @param {string} attrName
     * @protected
     */
    _deactivateOwnedDataAttr(attrName) {
        deactivate(this._elemOfOwnedDataAttr(attrName));
    }

    /**
     * @param {string} attrName
     * @protected
     */
    _activateOwnedDataAttr(attrName) {
        activate(this._elemOfOwnedDataAttr(attrName));
    }

    /**
     * @param {string} attrName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _elemOfOwnedDataAttr(attrName) {
        return elemOfOwnedDataAttr(this.componentId, attrName);
    }
}