import EventsBinder from "../../../html-puppeteer/core/EventsBinder.js";
import {namedBtn} from "../../../html-puppeteer/util/SelectorUtils.js";

export default class Scenario6EventsBinder extends EventsBinder {
    /**
     * @return {ClockComponent}
     */
    get clock() {
        return /** @type {ClockComponent} */ this.component;
    }

    attachEventHandlers() {
        $(namedBtn("start")).on("click.Scenario6EventsBinder", () => this.clock.startClock());
        $(namedBtn("stop")).on("click.Scenario6EventsBinder", () => {
            this.clock.stopClock();
            alert("clock stopped!");
        });
    }

    detachEventHandlers() {
        $(namedBtn("start")).off(".Scenario6EventsBinder");
        $(namedBtn("stop")).off(".Scenario6EventsBinder");
    }
}