import EventsBinder from "../../../html-puppeteer/core/EventsBinder.js";
import {namedBtn} from "../../../html-puppeteer/util/SelectorUtils.js";

export default class Scenario6EventsBinder extends EventsBinder {
    attachEventHandlers() {
        const clock = /** @type {ClockComponent} */ this.component;
        $(namedBtn("start")).on("click.Scenario6EventsBinder", () => clock.startClock());
        $(namedBtn("stop")).on("click.Scenario6EventsBinder", () => clock.stopClock());
    }

    detachEventHandlers() {
        $(namedBtn("start")).off(".Scenario6EventsBinder");
        $(namedBtn("stop")).off(".Scenario6EventsBinder");
    }
}