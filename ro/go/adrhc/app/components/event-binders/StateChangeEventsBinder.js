import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {$btnOf} from "../../../html-puppeteer/util/SelectorUtils.js";
import {partsOf} from "../../../html-puppeteer/core/state/PartialStateHolder.js";
import {jsonParsedValOf} from "../../../html-puppeteer/util/DomUtils.js";
import {when} from "../../../html-puppeteer/helper/DomEventHandlerBuilder.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        $btnOf("change-parent-state").removeAttr('disabled');
        $btnOf("change-partial-state").removeAttr('disabled');
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
        $btnOf("change-parent-state").attr('disabled', 'disabled');
        $btnOf("change-partial-state").attr('disabled', 'disabled');
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
        } else {
            partsOf(parts).forEach(([key, value]) => this.replacePart(key, value));
        }
    }
}
