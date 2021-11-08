import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {$btnOf} from "../../../html-puppeteer/util/SelectorUtils.js";
import {partsOf} from "../../../html-puppeteer/core/state/PartialStateHolder.js";
import {activate, deactivate, jsonParsedValOf} from "../../../html-puppeteer/util/DomUtils.js";
import {when} from "../../../html-puppeteer/helper/events-handling/DomEventsAttachBuilder.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * @type {ElemIdOrJQuery}
     */
    completeStateJsonElemIdOrJQuery;
    /**
     * @type {ElemIdOrJQuery}
     */
    partialStateJsonElemIdOrJQuery;

    /**
     * @param {ElemIdOrJQuery} completeStateJsonElemIdOrJQuery
     * @param {ElemIdOrJQuery=} partialStateJsonElemIdOrJQuery
     * @param {AbstractComponent=} component
     */
    constructor(completeStateJsonElemIdOrJQuery, partialStateJsonElemIdOrJQuery, component) {
        super(component);
        this.completeStateJsonElemIdOrJQuery = completeStateJsonElemIdOrJQuery ?? "debugger-component";
        this.partialStateJsonElemIdOrJQuery = partialStateJsonElemIdOrJQuery ?? "partial-state";
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._activateButtons("change-entire-state", "change-partial-state");
        when("click").occurOnBtn("change-entire-state").do(() => {
            this._component.replaceState(jsonParsedValOf(this.completeStateJsonElemIdOrJQuery));
        });
        when("click").occurOnBtn("change-partial-state").do(() => {
            this._replaceParts(jsonParsedValOf(this.partialStateJsonElemIdOrJQuery));
        });
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._deactivateButtons("change-entire-state", "change-partial-state");
        $btnOf("change-entire-state").off("click");
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
