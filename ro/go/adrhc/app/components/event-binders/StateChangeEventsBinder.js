import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {$btnOf} from "../../../html-puppeteer/util/SelectorUtils.js";
import {partsOf} from "../../../html-puppeteer/core/state/PartialStateHolder.js";
import {activate, deactivate, jsonParsedValOf} from "../../../html-puppeteer/util/DomUtils.js";
import {when} from "../../../html-puppeteer/helper/DomEventHandlerBuilder.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        activate($btnOf("change-parent-state"), $btnOf("change-partial-state"));
        when("click").occurOnBtn("change-parent-state").do(() => {
            this._component.replaceState(jsonParsedValOf("main-debugger"));
        });
        when("click").occurOnBtn("change-partial-state").do(() => {
            this._replaceParts(jsonParsedValOf("partial-state"));
        });
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        deactivate($btnOf("change-parent-state"), $btnOf("change-partial-state"));
        $btnOf("change-parent-state").off("click");
        $btnOf("change-partial-state").off("click");
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
