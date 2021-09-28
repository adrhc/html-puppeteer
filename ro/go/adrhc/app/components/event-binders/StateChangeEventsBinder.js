import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {namedBtn} from "../../../html-puppeteer/util/SelectorUtils.js";

export default class StateChangeEventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        $(namedBtn("change-parent-state")).removeAttr('disabled');
        $(namedBtn("change-partial-state")).removeAttr('disabled');
        $(namedBtn("change-parent-state")).on("click",
            () => {
                this._component.replaceState(JSON.parse($("#main-debugger").val()));
            });
        $(namedBtn("change-partial-state")).on("click", () => {
            const guestsState = JSON.parse($("#partial-state").val());
            this._component.replaceParts(guestsState);
        });
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        $(namedBtn("change-parent-state")).attr('disabled', 'disabled');
        $(namedBtn("change-partial-state")).attr('disabled', 'disabled');
        $(namedBtn("change-parent-state")).off("click");
        $(namedBtn("change-partial-state")).off("click");
    }
}