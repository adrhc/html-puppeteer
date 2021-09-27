import EventsBinder from "./EventsBinder.js";
import {dataOwnerSelectorOf} from "../../../util/SelectorUtils.js";
import {isTrue} from "../../../util/AssertionUtils.js";

export default class SimpleEventsBinder extends EventsBinder {
    /**
     * @type {string}
     */
    owner;

    /**
     * @param {AbstractComponent=} component
     */
    constructor(component) {
        super(component);
        this.owner = component.id;
    }

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
        isTrue(!!event, "[SimpleEventsBinder] event can't be empty!");
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
        return $(`${dataOwnerSelectorOf(this.owner)}[data-${dataAttribName}]`);
    }
}