import EventsBinder from "./EventsBinder.js";
import {dataOwnerSelectorOf} from "../../../util/SelectorUtils.js";
import {isTrue} from "../../../util/AssertionUtils.js";

export default class SimpleEventsBinder extends EventsBinder {
    /**
     * @type {boolean}
     */
    openEventAttached;
    /**
     * @type {string}
     */
    owner;

    constructor(component) {
        super(component);
        this.owner = component.id;
    }

    attachEventHandlers() {
        !this.openEventAttached && this._attachHandlerByDataAttrib("open", () => {
            this.component.render();
        });
        this._attachHandlerByDataAttrib("close", () => {
            this.component.close();
        });
        this.openEventAttached = true;
    }

    /**
     * @param {string} dataAttribName
     * @param {function} fn
     * @protected
     */
    _attachHandlerByDataAttrib(dataAttribName, fn) {
        const $el = $(`${dataOwnerSelectorOf(this.owner)}[data-${dataAttribName}]`);
        if (!$el.length) {
            return;
        }
        const event = $el.data(dataAttribName);
        isTrue(!!event, "[SimpleEventsBinder] event can't be empty!");
        $($el).on(event, fn);
    }

    /**
     * @param {string} dataAttribName
     * @protected
     */
    _detachHandlerByDataAttrib(dataAttribName) {
        const $el = $(`${dataOwnerSelectorOf(this.owner)}[data-${dataAttribName}]`);
        if (!$el.length) {
            return;
        }
        const event = $el.data(dataAttribName);
        $el.off(event)
    }

    detachEventHandlers() {
        // keep basic events otherwise "open" won't work
        this._detachHandlerByDataAttrib("close");
    }
}