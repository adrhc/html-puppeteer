import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {$btnOf} from "../../../html-puppeteer/util/SelectorUtils.js";
import {partsOf} from "../../../html-puppeteer/core/state/PartialStateHolder.js";
import {activate, deactivate, jsonParsedValOf} from "../../../html-puppeteer/util/DomUtils.js";
import {when} from "../../../html-puppeteer/helper/events-handling/DomEventsAttachBuilder.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * @type {ElemIdOrJQuery}
     */
    debuggerElemIdOrJQuery;

    /**
     * @param {ElemIdOrJQuery} debuggerElemIdOrJQuery
     * @param {AbstractComponent=} component
     */
    constructor(debuggerElemIdOrJQuery, component) {
        super(component);
        this.debuggerElemIdOrJQuery = debuggerElemIdOrJQuery;
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._activateButtons("change-parent-state", "change-partial-state");
        when("click").occurOnBtn("change-parent-state").do(() => {
            this._component.replaceState(jsonParsedValOf(this.debuggerElemIdOrJQuery));
        });
        when("click").occurOnBtn("change-partial-state").do(() => {
            this._replaceParts(jsonParsedValOf("partial-state"));
        });
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._deactivateButtons("change-parent-state", "change-partial-state");
        $btnOf("change-parent-state").off("click");
        $btnOf("change-partial-state").off("click");
    }

    /**
     * @param {string} names
     * @protected
     */
    _activateButtons(...names) {
        names.forEach(it => activate($btnOf(it)));
    }

    /**
     * @param {string} names
     * @protected
     */
    _deactivateButtons(...names) {
        names.forEach(it => deactivate($btnOf(it)));
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: *}[]} parts
     * @protected
     */
    _replaceParts(parts) {
        if (typeof this._component.replaceParts === "function") {
            this._component.replaceParts(parts);
        } else if (typeof this._component.replacePart === "function") {
            partsOf(parts).forEach(([key, value]) => this._component.replacePart(key, value));
        } else {
            alert(`this._component cant do partial replace! config:\n${JSON.stringify(this._component.config)}`);
        }
    }
}
