import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {$btnOf} from "../../../html-puppeteer/util/SelectorUtils.js";
import {activate, deactivate, jsonParsedValOf} from "../../../html-puppeteer/util/DomUtils.js";
import {eventsBinder} from "../../../html-puppeteer/helper/events-handling/EventsBinderBuilder.js";
import {replaceParts} from "../../../html-puppeteer/util/ComponentUtils.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * @type {EventsHandlerDetachFn}
     * @private
     */
    _eventsHandlerDetachFn
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
        this._eventsHandlerDetachFn = eventsBinder()
            .whenEvents("click")
            .occurOnBtn("change-entire-state")
            .do(() => {
                this._component.replaceState(jsonParsedValOf(this.completeStateJsonElemIdOrJQuery));
            })
            .and()
            .whenEvents("click")
            .occurOnBtn("change-partial-state")
            .do(() => {
                replaceParts(this._component, jsonParsedValOf(this.partialStateJsonElemIdOrJQuery));
            })
            .and()
            .buildDetachEventsHandlersFn();
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._eventsHandlerDetachFn?.();
        this._deactivateButtons("change-entire-state", "change-partial-state");
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
}
