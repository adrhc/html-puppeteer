import EventsBinder from "./EventsBinder.js";
import {dataOwnerSelectorOf} from "../../../util/SelectorUtils.js";
import {isTrue} from "../../../util/AssertionUtils.js";

export default class OpenCloseEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._attachHandlerByDataAttrib("open", () => {
            this._$elemOf("open").addClass("disabled");
            this._$elemOf("close").removeClass("disabled");
            this.component.render();
        });
        this._attachHandlerByDataAttrib("close", () => {
            this._$elemOf("close").addClass("disabled");
            this._$elemOf("open").removeClass("disabled");
            this.component.close();
        }, true);
    }

    /**
     * @param {string} dataAttribName
     * @param {function} fn
     * @param {boolean=} oneTimeOnly
     * @protected
     */
    _attachHandlerByDataAttrib(dataAttribName, fn, oneTimeOnly) {
        const $el = this._$elemOf(dataAttribName);
        if (!$el.length) {
            return;
        }
        const event = $el.data(dataAttribName);
        isTrue(!!event, "[OpenCloseEventsBinder] event can't be empty!");
        // removing previous handler (if any) set by another component
        $($el).off(event);
        $($el)[oneTimeOnly ? "one" : "on"](event, fn);
    }

    /**
     * @param {string} dataAttribName
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$elemOf(dataAttribName) {
        return $(`${dataOwnerSelectorOf(this.component.id)}[data-${dataAttribName}]`);
    }
}